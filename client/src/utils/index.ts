

export function isValidArray(input: any): input is any[] {
    return Array.isArray(input) && input != null;
}

export function getFirstComponentByType(entities: any[] | null | undefined, typename: string): any | null {
    if (!isValidArray(entities)) return null;

    for (let entity of entities) {
        if (isValidArray(entity?.node.components)) {
            const foundComponent = entity.node.components.find((comp: any) => comp.__typename === typename);
            if (foundComponent) return foundComponent;
        }
    }
    return null;
}

export function extractAndCleanKey(entities?: any[] | null | undefined): string | null {

    if (!isValidArray(entities) || !entities[0]?.keys) return null;

    return entities[0].keys.replace(/,/g, '');
}


//what?
export function addPrefix0x(input: string | number): string {
    return `0x${input}`;
}

export function decimalToHexadecimal(number: number): string {
    if (isNaN(number) || !isFinite(number)) {
        throw new Error(`Input must be a valid number ${number}`);
    }

    const hexadecimalString = number.toString(16).toUpperCase();
    return `0x${hexadecimalString}`;
}

export function hexToNumber(hexString: string): number {
    return parseInt(hexString, 16);
}



export function truncateString(inputString: string, prefixLength: number): string {
    if (inputString.length <= prefixLength) {
        return inputString; // No need to truncate if the string is already short enough
    }

    const prefix = inputString.substring(0, prefixLength);
    const suffix = inputString.slice(-3);

    return `${prefix}...${suffix}`;
}

// Pads a hex string to 64 chars as expected by torii queries
export function padHex(hexAddress: string): string {
    // convert a hex encoded address to a 64 byte long hex string by removing the leading 0x, padding with 0 and then readding the prefix
    // strip 0x if present
    const hexAddressWithoutPrefix = hexAddress.replace('0x', '');
    const paddedHexAddress = hexAddressWithoutPrefix.padStart(64, '0');
    return `0x${paddedHexAddress}`;
}
