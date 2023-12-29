import { DetailedHTMLProps, HTMLAttributes } from "react";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const ClickWrapper = (props: Props) => {
    const { children, style } = props;

    return (
        <div {...props} style={{ pointerEvents: "all", ...style }}>
            {children}
        </div>
    );
};