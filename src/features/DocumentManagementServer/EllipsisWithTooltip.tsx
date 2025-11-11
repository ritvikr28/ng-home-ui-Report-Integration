import React, { useEffect } from "react";
import {
  Tooltip,
  TooltipAlign,
  TooltipPosition,
  Tag
} from "@essnextgen/ui-kit";
import { useIsEllipsed } from "./useIsEllipsed";

interface Props {
  text: any;
  className: string;
  isTooltipNeeded: boolean;
  totalItems: any[];
}

export const EllipsisWithTooltip: React.FC<Props> = ({
  text,
  className,
  isTooltipNeeded,
  totalItems = [],
}) => {
  const [hrefUrl, setHrefUrl] = React.useState<string>("/");
  const [relatedName, setRelatedName] = React.useState<string>("");
  const [yearRegTag, setYearRegTag] = React.useState<string>("");
  const { ref, isEllipsed } = useIsEllipsed({ deps: [text?.name] }) as {
    ref: React.RefObject<HTMLAnchorElement | HTMLSpanElement>;
    isEllipsed: boolean;
  };

  const getProfileUrl = (type: string, id?: string): string => {
    if (!id) return "/";
    if (type === "staff") return `/staff/profile/${id}`;
    if (type === "pupil") return `/pupilprofile/profile/${id}`;
    return "/";
  };

  const getDisplayName = (t: any): string => {
    if (!t?.name) return "";
    if (t.type === "staff") return `${t.name}${t.staffCode ? ` | ${t.staffCode}` : ""}`;
    return t.name;
  };

  const getYearRegText = (isLeaver?: string, year?: string, reg?: string, separator: string = ""): string => {
    if (!year && !reg) return "";
    const prefix = separator ? ` ${separator} ` : "";
    const isLeaverFlag = isLeaver?.toLowerCase() === "leaver";
    if (isLeaverFlag) return `${prefix} (${year})${reg ? ` / (${reg})` : ""}`;
    return `${prefix} ${year}${reg ? ` / ${reg}` : ""}`;
  };


  useEffect(() => {
    setHrefUrl(getProfileUrl(text.type, text.referenceExternalId));
    setRelatedName(getDisplayName(text));
    setYearRegTag(
      text.type === "pupil"
        ? getYearRegText(text.isLeaver, text.year, text.reg)
        : ""
    );
  }, [text]);


  const renderMainContent = () => {
    const tooltipContent =
      (isTooltipNeeded ?? true) && isEllipsed ? <span>{text.name}</span> : null;

    const content =
      text.type === "staff" || text.type === "pupil" ? (
        <a
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={hrefUrl}
          className="relatedto-link document-text"
          target="_blank"
          rel="noopener noreferrer"
        >
          {relatedName}
        </a>
      ) : (
        <span
          ref={ref as React.RefObject<HTMLSpanElement>}
          className="document-text"
        >
          {relatedName}
        </span>
      );

    return (
      <Tooltip
        dataTestId="tooltip-eventtime"
        content={tooltipContent}
        align={TooltipAlign.Center}
        position={TooltipPosition.Bottom}
      >
        {content}
      </Tooltip>
    );
  };

  const renderExtraItemsTooltip = () => {
    if (totalItems.length <= 1) return null;

    return (
      <Tooltip
        dataTestId="tooltip-extra"
        align={TooltipAlign.Center}
        position={TooltipPosition.Bottom}
        content={
          <div className="relatedto-tooltip scrollable-tooltip">
            {totalItems.map((item: any, idx: number) => (
              <div key={`${item.name}-${idx}`}>
                <span>
                  {item.name}
                  {item.type === "staff" && item.staffCode
                    ? ` | ${item.staffCode}`
                    : ""}
                  {item.type === "pupil"
                    ? ` ${getYearRegText(item.isLeaver, item.year, item.reg, "|")}`
                    : ""}
                </span>
              </div>
            ))}
          </div>
        }
      >
        <div className="tooltip-content">
          <span>{`+${totalItems.length - 1}`}</span>
        </div>
      </Tooltip>
    );
  };


  return (
    <div className={`ellipsis-cell ${className}`}>
      {renderMainContent()}
      {text.type === "pupil" && yearRegTag && (
        <Tag
          dataTestId="name"
          id="name"
          className="relatedto-tag"
          text={yearRegTag}
        />
      )}
      {renderExtraItemsTooltip()}
    </div>
  );
};
