import { Link } from "@essnextgen/ui-kit"
import React from "react"
import gtmAnalytics from "../../utils/analytics"
import { ICommomComponent } from "./SectionTitleProps"
import "./style.scss"


export const SectionTitle: React.FC<ICommomComponent> = ({
    title,
    hasLink,
    linkText,
    linkhref,
    path }: ICommomComponent): JSX.Element => (
    <div className="new-title-container c-clear-margin-top c-clear-padding">
        <span className="new-title-text">{title} </span>
        {hasLink && (
            <span className="new-title-link">
                <Link
                    data-testid="link"
                    href={path === undefined ? `${linkhref}` : `${linkhref}/${path}`}
                    target="_self"
                    className="link-class"
                >
                    <span data-testid="link-id" onClick={() => gtmAnalytics.pushEvent({
                        event: "click",
                        linkText,
                        linkUrl: linkhref,
                        clickType: "link",
                        clickLocation: "body"
                    })}>
                        {linkText}
                    </span>
                </Link>
            </span>)}
    </div>
)

