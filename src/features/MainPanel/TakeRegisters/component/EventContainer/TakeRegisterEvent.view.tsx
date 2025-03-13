import React, { useRef, useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import {
  ActionCard,
  Button,
  ButtonColor,
  ButtonSize,
  Grid,
  GridItem,
  IconColor,
  TagColor,
  useMediaQuery
} from "@essnextgen/ui-kit";
import { IRegisterViewProps } from "./props";

import "./carousalstyle.scss";
import { responsive, iscloseresponsive } from "./carousel";
import {
  envConfig,
  getUser,
  getUserOrganisation
} from "../../../../../shared/utils";
import { IRegistersDetails } from "../../../../../shared/model/RegisterDomain/responsemodels";
import gtmAnalytics from "../../../../../shared/utils/analytics";
import { logger } from "../../../../../shared/components/AppInsights";
import { SectionTitle } from "../../../../../shared/components/SectionTitle/SectionTitle";

const TakeRegisterEventView: React.FC<IRegisterViewProps> = ({
  apiRegsiterEventData,
  apiError,
  isOpen,
}: IRegisterViewProps): JSX.Element => {
  const carouselRef: any = useRef(null);
  const [effectTriggered, setEffectTriggered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(
    apiRegsiterEventData ? 0 : 0
  );
  const [carouselData, setCarouselData] = useState(responsive);
  const setDefaultSlide = (index: number) => {
    /* istanbul ignore next */
    carouselRef.current.goToSlide(index);
  };

  useEffect(() => {
    /* eslint-disable */
    isOpen ? setCarouselData(responsive) : setCarouselData(iscloseresponsive);
  }, [isOpen]);

  /* eslint-enable */

  const isMediumscreen: boolean = useMediaQuery("(min-width:1439.9px)");
  useEffect(() => {
    if (apiRegsiterEventData != null && apiRegsiterEventData.length > 0) {
      if (carouselRef && carouselRef.current && !effectTriggered) {
        const Index = apiRegsiterEventData.findIndex((x) => {
          if (x.eventStart != null && x.eventEnd != null) {
            const formattedLocalTime = new Date();
            const currentUTCDateTime = formattedLocalTime
              .toISOString()
              .split(".")[0];
            return (
              (Date.parse(x.eventStart) <= Date.parse(currentUTCDateTime) &&
                Date.parse(currentUTCDateTime) <= Date.parse(x.eventEnd)) ||
              Date.parse(x.eventStart) > Date.parse(currentUTCDateTime)
            );
          }
          /* istanbul ignore next */
          return -1;
        });

        setEffectTriggered(true);
        if (Index < 0) {
          setDefaultSlide(apiRegsiterEventData.length);
          setCurrentSlide(apiRegsiterEventData.length - 1);
        } else {
          setDefaultSlide(Index);
          if (apiRegsiterEventData.length - Index <= 3)
            setCurrentSlide(apiRegsiterEventData.length - 1);
          else setCurrentSlide(Index);
        }
      }
    }
  });
  /* istanbul ignore next */
  const nextSlide = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
      moveRight();
    }
  };
  /* istanbul ignore next */
  const moveRight = () => {
    const totalLength = apiRegsiterEventData ? apiRegsiterEventData.length : 0;

    setCurrentSlide((prevSlide) => {
      if (window.innerWidth < 768) {
        return prevSlide + 1 >= totalLength ? totalLength : prevSlide + 1;
      }
      if (window.innerWidth >= 768 && window.innerWidth < 1440) {
        return prevSlide + 2 >= totalLength ? totalLength : prevSlide + 2;
      }
      return prevSlide + 3 >= totalLength ? totalLength : prevSlide + 3;
    });
  };

  /* istanbul ignore next */
  const moveLeft = () => {
    setCurrentSlide((prevSlide) => {
      if (window.innerWidth < 768) {
        return Math.max(prevSlide - 1, 0);
      }
      if (window.innerWidth >= 768 && window.innerWidth < 1440) {
        return Math.max(prevSlide - 2, 0);
      }
      return Math.max(prevSlide - 3, 0);
    });
  };

  /* istanbul ignore next */
  const previousSlide = () => {
    if (carouselRef.current && currentSlide > 0) {
      carouselRef.current.previous();
      moveLeft();
    }
  };

  /* istanbul ignore next */
  const FilledGraphDataIcon = () => (
    /* istanbul ignore next */
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

  const OnRegisterClick = (item: IRegistersDetails) => {
    const url =
      item.eventTypeCode === "AttendanceSession"
        ? `${envConfig.REGISTER_BASE_URL}/take-register/${item.eventDescription}/${item.group.externalId}/${item.eventInstanceExternalId}`
        : `${envConfig.REGISTER_BASE_URL}/take-register/${item.classPeriodExternalId}/${item.group.externalId}/${item.eventInstanceExternalId}`;

    logger.info(
      `Click on registers -${url} organisationId- ${getUserOrganisation()} userId- ${getUser()}`
    );

    gtmAnalytics.pushEvent({
      event: "click",
      linkText: "[RemovedClassName]",
      linkUrl: url,
      clickType: "card",
      clickLocation: "body",
    });
    /* istanbul ignore next */
    window.open(url, "_self");
  };
  return (
    <>
      <Grid className="register-icon">
        <GridItem sm={9} lg className="c-clear-padding">
          <SectionTitle
            title="Your registers"
            hasLink
            linkText="View all registers"
            linkhref={envConfig.REGISTER_BASE_URL}
          />
        </GridItem>
        <GridItem sm lg className="new-carosel-colum c-clear-padding-left">
          <Button
            className="base-class"
            iconColor={IconColor.Neutral800}
            dataTestId="btn-previous"
            color={ButtonColor.Utility}
            ariaLabel="carousel-left-btn"
            iconName="chevron--left"
            onClick={previousSlide}
            size={ButtonSize.Small}
            type="button"
            /* eslint-disable */
            disabled={
              apiRegsiterEventData == null
                ? true
                : window.innerWidth > 768 && window.innerWidth < 1440
                ? currentSlide === 0 || apiRegsiterEventData.length < 2
                : window.innerWidth < 768
                ? currentSlide === 0 || apiRegsiterEventData.length < 1
                : currentSlide === 0 || apiRegsiterEventData.length < 4
            }
            /* eslint-enable */
          />
          <Button
            className="base-class"
            iconColor={IconColor.Neutral800}
            dataTestId="btn-next"
            color={ButtonColor.Utility}
            iconName="chevron--right"
            ariaLabel="carousel-right-btn"
            onClick={nextSlide}
            size={ButtonSize.Small}
            type="button"
            /* eslint-disable */
            disabled={
              apiRegsiterEventData == null
                ? true
                : window.innerWidth > 768 && window.innerWidth < 1440
                ? currentSlide === (apiRegsiterEventData.length ?? 0) - 1 ||
                  currentSlide + 2 > apiRegsiterEventData.length
                : window.innerWidth < 768
                ? currentSlide + 1 > apiRegsiterEventData.length
                : currentSlide === (apiRegsiterEventData.length ?? 0) - 1 ||
                  currentSlide + 3 >= apiRegsiterEventData.length
              /* eslint-enable */
            }
          />
        </GridItem>
      </Grid>

      <div>
        {apiError === false &&
        apiRegsiterEventData &&
        apiRegsiterEventData.length > 0 ? (
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
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            itemClass="carousel-item-padding-40-px"
          >
            {apiRegsiterEventData &&
              apiRegsiterEventData.map((item, index) => (
                <div
                  key={`key-${index}`}
                  className="new-action-card-accodian-container"
                >
                  <ActionCard
                    dataTestId={`test-id${index}`}
                    icon={<FilledGraphDataIcon />}
                    id={`action-card${index}`}
                    onClickActionCard={() => {
                      OnRegisterClick(item);
                    }}
                    primaryText={
                      `${item.group.shortName!} ${
                        item.room ? ` | ${item.room.roomName!}` : ""
                      }`.length > 16 && isMediumscreen
                        ? `${(
                            item.group.shortName! +
                            (item.room ? ` | ${item.room.roomName!}` : "")
                          ).substring(0, 16)}...`
                        : `${item.group.shortName!} ${
                            item.room ? ` | ${item.room.roomName!}` : ""
                          }`
                    }
                    tagText={item.isCompleted ? "Completed" : "Ready"}
                    isShowTag
                    tagColor={
                      item.isCompleted ? TagColor.Success : TagColor.Outstanding
                    }
                    isShowArrowIcon
                  />
                </div>
              ))}
            {apiRegsiterEventData.length > 0 && (
              <div
                className="new-action-card-accodian-container noregister eventcardnohighlight"
              >
                <ActionCard
                  dataTestId="test-id"
                  icon={<FilledGraphDataIcon />}
                  id="no-more-register-id"
                  onClickActionCard={() => {}}
                  primaryText="No more registers"
                  isShowArrowIcon={false}
                />
              </div>
            )}
          </Carousel>
        ) : (
          apiError === false &&
          (apiRegsiterEventData == null ||
            apiRegsiterEventData.length === 0) && (
            <div
              className="new-action-card-accodian-container carousel-item-padding-40-px noregisterblock no-register-box eventcardnohighlight"
            >
              <ActionCard
                dataTestId="no-test-id"
                icon={<></>}
                id="no-register-id"
                onClickActionCard={() => {}}
                primaryText="No registers today"
                isShowArrowIcon={false}
              />
            </div>
          )
        )}
      </div>
    </>
  );
};

export default TakeRegisterEventView;
