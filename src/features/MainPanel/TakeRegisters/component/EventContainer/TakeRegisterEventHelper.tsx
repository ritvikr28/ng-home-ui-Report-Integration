import Carousel from "react-multi-carousel";
import { ActionCard, TagColor } from "@essnextgen/ui-kit";
import React from "react";
import { envConfig, getUser, getUserOrganisation } from "../../../../../shared/utils";
import gtmAnalytics from "../../../../../shared/utils/analytics";
import { logger } from "../../../../../shared/components/AppInsights";
import { IRegistersDetails } from "../../../../../shared/model/RegisterDomain/responsemodels";
import { responsive } from "./carousel";
import "./carousalstyle.scss";

export const setDefaultAndCurrentSlide: (
  carouselRef: React.RefObject<Carousel>,
  apiRegsiterEventData: IRegistersDetails[],
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>
) => void = (carouselRef, apiRegsiterEventData, setCurrentSlide) => {
  const Index: number = findCurrentIndex(apiRegsiterEventData);

  const isLastFewSlides =
    Index >= 0 && apiRegsiterEventData.length - Index <= 3;

  carouselRef.current?.goToSlide(
    Index < 0 ? apiRegsiterEventData.length : Index
  );

  let newSlideIndex: number;

  if (Index < 0) {
    newSlideIndex = apiRegsiterEventData.length - 1;
  } else if (isLastFewSlides) {
    newSlideIndex = apiRegsiterEventData.length - 1;
  } else {
    newSlideIndex = Index;
  }

  // Set the current slide
  setCurrentSlide(newSlideIndex);
};

const isEventInProgress = (eventStart: string, eventEnd: string, currentLocalDateTime: Date): boolean =>
  new Date(eventStart) <= currentLocalDateTime && currentLocalDateTime <= new Date(eventEnd);


const isEventUpcoming: (eventStart: string, currentLocalDateTime: Date) => boolean = (eventStart: string, currentLocalDateTime: Date): boolean =>
  new Date(eventStart) > currentLocalDateTime;

export const findCurrentIndex: (apiRegsiterEventData: IRegistersDetails[]) => number = (apiRegsiterEventData) => {
  const currentLocalDateTime: Date = new Date();
  return apiRegsiterEventData.findIndex(
    (x) =>
      x.eventStart != null &&
      x.eventEnd != null &&
      (isEventInProgress(x.eventStart, x.eventEnd, currentLocalDateTime) ||
        isEventUpcoming(x.eventStart, currentLocalDateTime))
  );
};



export const renderCarousel: (
  apiRegsiterEventData: IRegistersDetails[],
  isMediumscreen: boolean,
  carouselRef: React.RefObject<Carousel>,
  carouselData: typeof responsive,
  handleRegisterClick: (item: IRegistersDetails) => void,
  t: (key: string) => string
) => JSX.Element = (apiRegsiterEventData, isMediumscreen, carouselRef, carouselData, handleRegisterClick, t) => (
  <Carousel
    ref={carouselRef}
    slidesToSlide={window.innerWidth <= 768 ? 1 : 4}
    arrows={false}
    swipeable={false}
    draggable={false}
    showDots={false}
    responsive={carouselData}
    infinite={false}
    keyBoardControl
    customTransition="all .5"
    transitionDuration={50}
     containerClass="carousel-container reg-css-new"
    removeArrowOnDeviceType={["tablet", "mobile"]}
    itemClass="carousel-item-padding-40-px"
  >
    {apiRegsiterEventData.map((item, index) => (
      <div
        key={`key-${index}`}
        className="new-action-card-accodian-container"
      >
        <ActionCard
          dataTestId={`test-id${index}`}
          icon={<FilledGraphDataIcon />}
          id={`action-card${index}`}
          onClickActionCard={() => handleRegisterClick(item)}
          primaryText={getPrimaryText(item, isMediumscreen)}
          secondaryText={getSecondaryText(item)}
          tagText={
            item.isCompleted
              ? t("takeregister.completed")
              : t("takeregister.ready")
          }
          isShowTag
          isTagLeftAligned
          tagColor={
            item.isCompleted ? TagColor.Success : TagColor.Outstanding
          }
          isShowArrowIcon
        />
      </div>
    ))}
    <div className="new-action-card-accodian-container noregister eventcardnohighlight">
      <ActionCard
        dataTestId="test-id"
        icon={<FilledGraphDataIcon />}
        id="no-more-register-id"
        onClickActionCard={() => { }}
        primaryText={t("takeregister.nomoreregister")}
        isShowArrowIcon={false}
      />
    </div>
  </Carousel>
);

export const renderNoRegisterMessage: (t: (key: string) => string) => JSX.Element = (t) => (
  <div className="new-action-card-accodian-container carousel-item-padding-40-px noregisterblock no-register-box eventcardnohighlight">
    <ActionCard
      dataTestId="no-test-id"
      icon={<></>}
      id="no-register-id"
      onClickActionCard={() => { }}
      primaryText={t("takeregister.noregistertoday")}
      isShowArrowIcon={false}
    />
  </div>
);


export const nextSlide: (
  carouselRef: any,
  apiRegsiterEventData: IRegistersDetails[] | null,
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>
) => void = (carouselRef, apiRegsiterEventData, setCurrentSlide) => {
  if (carouselRef.current) {
    carouselRef.current.next();
    moveRight(apiRegsiterEventData, setCurrentSlide);
  }
};

export const moveRight: (
  apiRegsiterEventData: IRegistersDetails[] | null,
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>
) => void = (apiRegsiterEventData, setCurrentSlide) => {
  const totalLength = apiRegsiterEventData?.length || 0;
  setCurrentSlide((prevSlide) => calculateNextSlide(prevSlide, totalLength));
};

export const moveLeft: (
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>
) => void = (setCurrentSlide) => {
  setCurrentSlide((prevSlide) => calculatePreviousSlide(prevSlide));
};

export const previousSlide: (
  carouselRef: any,
  currentSlide: number,
  setCurrentSlide: React.Dispatch<React.SetStateAction<number>>
) => void = (carouselRef, currentSlide, setCurrentSlide) => {
  if (carouselRef.current && currentSlide > 0) {
    carouselRef.current.previous();
    moveLeft(setCurrentSlide);
  }
};

export const isButtonDisabled: (
  direction: "previous" | "next",
  apiRegsiterEventData: IRegistersDetails[] | null,
  currentSlide: number
) => boolean = (direction, apiRegsiterEventData, currentSlide) => {
  if (!apiRegsiterEventData?.length) return true;

  const slidesToShow: number = getSlidesToShow();
  return direction === "previous"
    ? currentSlide === 0
    : currentSlide + slidesToShow >= apiRegsiterEventData.length;
};

/**
 * Generates the URL for the register event.
 */
export const generateRegisterUrl: (item: IRegistersDetails) => string = (item) =>
  item.eventTypeCode === "AttendanceSession"
    ? `${envConfig.REGISTER_BASE_URL}/take-register/${item.eventDescription}/${item.group.externalId}/${item.eventInstanceExternalId}`
    : `${envConfig.REGISTER_BASE_URL}/take-register/${item.classPeriodExternalId}/${item.group.externalId}/${item.eventInstanceExternalId}`;


/**
 * Handles the click event for a register item.
 */
export const handleRegisterClick: (item: IRegistersDetails) => void = (item) => {
  const url: string = generateRegisterUrl(item);

  logger.info(
    `Click on registers -${url} organisationId- ${getUserOrganisation()} userId- ${getUser()}`
  );

  gtmAnalytics.pushEvent({
    event: "click",
    linkText: "[RemovedClassName]",
    linkUrl: url,
    clickType: "card",
    clickLocation: "body"
  });

  /* istanbul ignore next */
  const anchor : HTMLAnchorElement = document.createElement("a");
  anchor.href = url;
  anchor.target = "_self";
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor); // Attach to DOM
  anchor.click();                     // Simulate click
  document.body.removeChild(anchor); // Remove it after click
};

const FilledGraphDataIcon: () => JSX.Element = () => (
  <svg
    width="54"
    height="54"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 21V27"
      stroke="#18A0FB"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 14V27"
      stroke="#18A0FB"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 16V27"
      stroke="#18A0FB"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26 20V27"
      stroke="#18A0FB"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      opacity="0.05"
      cx="20"
      cy="20"
      r="20"
      transform="rotate(-90 20 20)"
      fill="#18A0FB"
    />
  </svg>
);

export const getSlidesToShow = (): number => {
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth >= 768 && window.innerWidth < 1440) return 2;
  return 3;
};

export const filterAndSortRegisterData: (data: IRegistersDetails[]) => IRegistersDetails[] = (data) => {
  if (!Array.isArray(data)) return [];
  
  return data
    .filter((item) => item.eventDescription && 
             item.eventStart && 
             item.eventEnd &&
             item.eventDescription.trim() !== '' &&
             item.eventStart.trim() !== '' &&
             item.eventEnd.trim() !== '')
    .sort((a, b) => {
      try {
        const dateA = new Date(a.eventStart).getTime();
        const dateB = new Date(b.eventStart).getTime();
        return dateA - dateB;
      } catch {
        return 0;
      }
    });
};

export const calculateNextSlide: (
  currentSlide: number,
  totalLength: number
) => number = (currentSlide, totalLength) => {
  const slidesToShow: number = getSlidesToShow(); // Use helper function
  return Math.min(currentSlide + slidesToShow, totalLength);
};

export const calculatePreviousSlide: (currentSlide: number) => number = (currentSlide) => {
  const slidesToShow: number = getSlidesToShow(); // Use helper function
  return Math.max(currentSlide - slidesToShow, 0);
};

export const getPrimaryText: (
  item: IRegistersDetails,
  isMediumscreen: boolean
) => string = (item, isMediumscreen) => {
  const text = `${item.group?.shortName || ''}${item.room ? ` | ${item.room.roomName}` : ''}`;

  if (isMediumscreen && text.length > 16) {
    return `${text.substring(0, 16)}...`;
  }

  return text;
};

export const getSecondaryText: (
  item: IRegistersDetails
) => string = (item) => {  

  function formatTime(dateTimeString: string): string {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return '';
    }
  }

  const startTime: string = item.eventStart ? formatTime(item.eventStart) : '';
  const endTime: string = item.eventEnd ? formatTime(item.eventEnd) : '';
  const timePeriod: string = startTime && endTime ? ` | ${startTime} - ${endTime}` : '';
  
 return `${item.eventDescription || ''}${timePeriod}`;
};