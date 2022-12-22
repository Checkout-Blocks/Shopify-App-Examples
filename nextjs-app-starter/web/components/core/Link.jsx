import Link from "next/link";

const PolarisLink = ({ url, external, children, ...rest }) => {
    const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

    if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
        return (
            <a {...rest} href={url} target="_blank" rel="noopener noreferrer">
                {children}
            </a>
        );
    }

    return (
        <Link {...rest} href={url} as={url}>
            {children}
        </Link>
    );
}

export default PolarisLink;
