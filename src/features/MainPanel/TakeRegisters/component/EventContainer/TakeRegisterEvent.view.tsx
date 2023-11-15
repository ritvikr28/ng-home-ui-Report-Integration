import React, { useRef, useState } from "react";

import Carousel from "react-multi-carousel";

import {
  ActionCard,
  Button,
  ButtonColor,
  ButtonSize,
  Grid,
  GridItem,
  IconColor,
  TagColor
} from "@essnextgen/ui-kit";
import { IRegisterViewProps } from "./props";
import TakeRegistersLinkview from "../TakeRegisterLink/TakeRegisterLink.view";
import "./carousalstyle.scss";
import { responsive } from "./carousel";

const TakeRegisterEventView: React.FC<IRegisterViewProps> = ({
  apiRegsiterEventData,
  apiError,
}: IRegisterViewProps): JSX.Element => {
  const carouselRef: any = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(
    apiRegsiterEventData ? 0 : 0
  );

  const nextSlide = () => {
    /* istanbul ignore next */
    if (carouselRef.current) {
      carouselRef.current.next();
      setCurrentSlide((prevSlide) => prevSlide + 1);
    }
  };

  const previousSlide = () => {
    if (carouselRef.current && currentSlide > 0) {
      carouselRef.current.previous();
      setCurrentSlide((prevSlide) => prevSlide - 1);
    }
  };

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

  return (
    <>
      <Grid>
        <GridItem lg={11} md={8} sm={4}>
          <TakeRegistersLinkview />
        </GridItem>
        <GridItem lg={1} md={8} sm={4}>
          <div style={{ display: "flex" }} className="register-icon">
            <div style={{ marginRight: "1px" }}>
              <Button
                className="base-class"
                iconColor={IconColor.Neutral800}
                dataTestId="btn-previous"
                color={ButtonColor.Utility}
                iconName="chevron--left"
                onClick={previousSlide}
                size={ButtonSize.Small}
                type="button"
                disabled={currentSlide === 0}
              />
            </div>
            <div>
              <Button
                className="base-class"
                iconColor={IconColor.Neutral800}
                dataTestId="btn-next"
                color={ButtonColor.Utility}
                iconName="chevron--right"
                onClick={nextSlide}
                size={ButtonSize.Small}
                type="button"
                disabled={
                  currentSlide === (apiRegsiterEventData?.length ?? 0) - 1
                }
              />
            </div>
          </div>
        </GridItem>
      </Grid>
      <div className="slider-div">
        <Grid>
          <GridItem lg={12} md={8} sm={4}>
            {apiError === false && apiRegsiterEventData && (
              <Carousel
                ref={carouselRef}
                slidesToSlide={3}
                arrows={false}
                swipeable={false}
                draggable={false}
                showDots={false}
                responsive={responsive}
                infinite={false}
                keyBoardControl
                customTransition="all .5"
                transitionDuration={500}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                itemClass="carousel-item-padding-40-px"
              >
                {apiError === false &&
                apiRegsiterEventData &&
                apiRegsiterEventData.length > 0 ? (
                  apiRegsiterEventData.map((item, index) => (
                    <div key={index} className="actioncard-div">
                      <ActionCard
                        dataTestId={`test-id${index}`}
                        icon={<FilledGraphDataIcon />}
                        id={`action-card${index}`}
                        onClickActionCard={() => {}}
                        primaryText={
                          item.baseGroup.code! +
                          (item.isLesson
                            ? +" | " + item.room.roomDescription!
                            : "")
                        }
                        tagText={item.isCompleted ? "Completed" : "Ready"}
                        isShowTag
                        tagColor={
                          item.isCompleted
                            ? TagColor.Success
                            : TagColor.Outstanding
                        }
                      />
                    </div>
                  ))
                ) : (
                  <div className="actioncard-div">
                    <ActionCard
                      dataTestId="test-id"
                      icon={<FilledGraphDataIcon />}
                      id="action-card"
                      onClickActionCard={() => {}}
                      primaryText="No registers"
                    />
                  </div>
                )}
                {/* { apiRegsiterEventData.length > 0 &&
              <div className="actioncard-div">
                <ActionCard
                  dataTestId="test-id"
                  icon={<></>}
                  id="action-card"
                  onClickActionCard={ () => {}}
                  primaryText="No more registers"
                />
              </div>
              } */}
              </Carousel>
            )}
          </GridItem>
        </Grid>
      </div>
    </>
  );
};

export default TakeRegisterEventView;
