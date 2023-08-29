import csv
import io
import os
import pickle
import re
import urllib
from typing import Optional

import requests
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials


class GoogleDriveClient:
    _SCOPES = [
        "https://www.googleapis.com/auth/drive.file",
    ]
    _TOKEN_FILE = "google_token.pickle"

    def __init__(self, secrets_file: str):
        self._secrets_file = secrets_file
        self._cached_creds: Optional[Credentials] = None

    def create_or_update_json(
        self, source: str, target_folder_id: str, name: str | None = None
    ) -> str:
        return self._create_or_update_file(
            "application/json", source, target_folder_id, name
        )

    def create_or_update_png(
        self, source: str, target_folder_id: str, name: str | None = None
    ) -> str:
        return self._create_or_update_file("image/png", source, target_folder_id, name)

    def _create_or_update_file(
        self, mime_type: str, source: str, target_folder_id: str, name: str | None
    ) -> str:
        target_name = os.path.split(source)[1] if name == None else name
        existing = self.get_ids(target_name, target_folder_id)
        existing_id = existing[0] if len(existing) > 0 else None

        if existing_id is not None:
            self._update_file(mime_type, source, existing_id)
            return existing_id
        else:
            return self._create_file(mime_type, source, target_folder_id, target_name)

    def create_json(self, source: str, target_folder_id: str, name: str | None = None) -> str:
        return self._create_file("application/json", source, target_folder_id, name)

    def create_png(self, source: str, target_folder_id: str, name: str | None = None) -> str:
        return self._create_file("image/png", source, target_folder_id, name)

    def create_csv(self, name: str, target_folder_id: str) -> str:
        creds = self._get_creds()
        service = build("sheets", "v4", credentials=creds)
        metadata = {
            "properties": {
                "title": name,
            },
        }
        spreadsheet = (
            service.spreadsheets()
            .create(body=metadata, fields="spreadsheetId")
            .execute()
        )
        id = spreadsheet.get("spreadsheetId")

        driveService = build("drive", "v3", credentials=creds)
        file = driveService.files().get(fileId=id, fields="parents").execute()
        oldParents = ",".join(file.get("parents"))
        file = (
            driveService.files()
            .update(fileId=id, addParents=target_folder_id, removeParents=oldParents)
            .execute()
        )
        driveService.permissions().create(
            fileId=id,
            body={
                "role": "writer",
                "type": "anyone",
            },
        ).execute()
        return id

    def _create_file(
        self, mime_type: str, source: str, target_folder_id: str, name: str | None
    ) -> str:
        target_name = os.path.split(source)[1] if name == None else name
        creds = self._get_creds()
        service = build("drive", "v3", credentials=creds)
        media = MediaFileUpload(source, mimetype=mime_type)
        file = (
            service.files()
            .create(
                body={"name": target_name, "parents": [target_folder_id]},
                media_body=media,
            )
            .execute()
        )

        service.permissions().create(
            fileId=file.get("id"),
            body={
                "role": "writer",
                "type": "anyone",
            },
        ).execute()

        return file.get("id")

    def update_json(self, source: str, target_id: str):
        self._update_file("application/json", source, target_id)

    def update_png(self, source: str, target_id: str):
        self._update_file("image/png", source, target_id)

    def _update_file(self, mime_type: str, source: str, target_id: str):
        creds = self._get_creds()
        service = build("drive", "v3", credentials=creds)
        media = MediaFileUpload(source, mimetype=mime_type)
        service.files().update(fileId=target_id, body={}, media_body=media).execute()

    # downloads a file by Id, or if folder_id is given, by name
    def download_file(
        self, id_or_name: str, output_file_name: str, folder_id: Optional[str]
    ):
        creds = self._get_creds()
        service = build("drive", "v3", credentials=creds)

        lookup_id = id_or_name
        if folder_id is not None:
            lookup_ids = self.get_ids(id_or_name, folder_id)
            lookup_id = lookup_ids[0] if len(lookup_ids) > 0 else id_or_name

        request = service.files().get_media(fileId=lookup_id)
        with io.BytesIO() as stream:
            downloader = MediaIoBaseDownload(stream, request)
            done = False
            while done is False:
                _, done = downloader.next_chunk()
            with open(output_file_name, "wb") as f:
                f.write(stream.getbuffer())

    def download_csv(self, id_or_name: str, folder_id: Optional[str]) -> csv.DictReader:
        creds = self._get_creds()
        service = build("sheets", "v4", credentials=creds)

        lookup_id = id_or_name
        if folder_id is not None:
            lookup_ids = self.get_ids(id_or_name, folder_id)
            lookup_id = lookup_ids[0] if len(lookup_ids) > 0 else lookup_id

        result = (
            service.spreadsheets()
            .get(
                spreadsheetId=lookup_id,
            )
            .execute()
        )

        if len(result["sheets"]) == 0:
            raise Exception("csv " + id + " is empty")

        url = result["spreadsheetUrl"]
        exportUrl = re.sub("\/edit$", "/export", url)
        headers = {
            "Authorization": "Bearer " + creds.token,
        }

        firstSheet = result["sheets"][0]
        params = {
            "format": "csv",
            "gid": firstSheet["properties"]["sheetId"],
        }
        queryParams = urllib.parse.urlencode(params)
        url = exportUrl + "?" + queryParams

        response = requests.get(url, headers=headers)
        contentString = response.content.decode(encoding=response.encoding)
        rows = contentString.split("\r\n")
        return csv.DictReader(rows, delimiter=",")

    def create_folder(self, name: str, parent_id: str) -> str:
        creds = self._get_creds()
        service = build("drive", "v3", credentials=creds)
        file = (
            service.files()
            .create(
                body={
                    "name": name,
                    "mimeType": "application/vnd.google-apps.folder",
                    "parents": [parent_id],
                },
                fields="id",
            )
            .execute()
        )
        service.permissions().create(
            fileId=file.get("id"),
            body={
                "role": "writer",
                "type": "anyone",
            },
        ).execute()
        return file.get("id")

    def download_folder(self, folder_id: str, output_folder: str):
        creds = self._get_creds()
        service = build("drive", "v3", credentials=creds)

        if not os.path.exists(output_folder):
            os.makedirs(output_folder)

        search_results: list[dict] = []
        page_token = None
        while True:
            # pylint: disable=maybe-no-member
            response = (
                service.files()
                .list(
                    q=f"'{folder_id}' in parents and trashed=false",
                    spaces="drive",
                    fields="nextPageToken, files(id, name, mimeType)",
                    pageToken=page_token,
                )
                .execute()
            )

            search_results.extend(response.get("files", []))
            page_token = response.get("nextPageToken", None)
            if page_token is None:
                break

        file_ids = map(
            lambda f: (f.get("id") or "", f.get("name") or "", f.get("mimeType") or ""),
            search_results,
        )
        for id, name, mtype in file_ids:
            try:
                if mtype == "image/png" or mtype == "application/json":
                    out_name = os.path.join(output_folder, name)
                    self.download_file(id, out_name, None)

                elif mtype == "application/vnd.google-apps.spreadsheet":
                    out_name = os.path.join(output_folder, name.split(".")[0] + ".csv")
                    reader: csv.DictReader = self.download_csv(id, None)
                    with open(out_name, "w+") as out_file:
                        writer = csv.DictWriter(out_file, fieldnames=reader.fieldnames)
                        writer.writeheader()
                        for row in reader:
                            writer.writerow(row)

                else:
                    print(
                        "Warning: unsupported file '"
                        + name
                        + "' with mtype '"
                        + mtype
                        + "'"
                    )
            except Exception as e:
                print(
                    "Warning: Failed to download " + name + ", id " + id + ": " + str(e)
                )

    def copy_file(
        self, id_or_name: str, source_folder: Optional[str], target_folder: str
    ) -> str:
        creds = self._get_creds()

        source_id = id_or_name
        if source_folder is not None:
            ids = self.get_ids(id_or_name, source_folder)
            source_id = ids[0] if len(ids) > 0 else id_or_name
        name = self.get_name(source_id)

        # clean up any copies in the target
        target_ids = self.get_ids(name, target_folder)
        for target_id in target_ids:
            self.delete_file(target_id)

        service = build("drive", "v3", credentials=creds)

        copy = (
            service.files()
            .copy(fileId=source_id, fields="id", body={"parents": [target_folder]})
            .execute()
        )
        return copy.get("id")

    def get_name(self, id: str) -> str:
        creds = self._get_creds()
        service = build("drive", "v3", credentials=creds)

        response = service.files().get(fileId=id, fields="name").execute()

        return response.get("name")

    def get_ids(self, name: Optional[str], folder_id: str) -> list[str]:
        creds = self._get_creds()
        service = build("drive", "v3", credentials=creds)

        files: list[dict] = []
        page_token = None
        while True:
            # pylint: disable=maybe-no-member
            response = (
                service.files()
                .list(
                    q=f"name='{name}' and '{folder_id}' in parents and trashed=false"
                    if name is not None
                    else f"'{folder_id}' in parents",
                    spaces="drive",
                    fields="nextPageToken, files(id)",
                    pageToken=page_token,
                )
                .execute()
            )

            files.extend(response.get("files", []))
            page_token = response.get("nextPageToken", None)
            if page_token is None:
                break
        return list(map(lambda f: f.get("id"), files))

    def delete_folder_contents(self, folder_id: str) -> int:
        ids = self.get_ids(None, folder_id)
        if len(ids) == 0:
            return 0

        return len(list(map(self.delete_file, ids)))

    def delete_file(self, file_id: str):
        creds = self._get_creds()
        service = build("drive", "v3", credentials=creds)
        service.files().delete(fileId=file_id).execute()

    def _get_creds(self) -> Credentials:
        if self._cached_creds is not None and self._cached_creds.valid:
            return self._cached_creds

        creds: Optional[Credentials] = None
        if os.path.exists(GoogleDriveClient._TOKEN_FILE):
            with open(GoogleDriveClient._TOKEN_FILE, "rb") as token:
                creds = pickle.load(token)

        if creds is None or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    self._secrets_file, GoogleDriveClient._SCOPES
                )
                creds = flow.run_local_server(port=8083)

            with open(GoogleDriveClient._TOKEN_FILE, "wb+") as token:
                pickle.dump(creds, token)

        self._cached_creds = creds
        return self._cached_creds
