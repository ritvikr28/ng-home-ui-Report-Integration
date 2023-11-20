import React, {useRef, useEffect,useState } from "react";
import Carousel from "react-multi-carousel";
import {
  ActionCard,
  Button,
  ButtonColor,
  ButtonSize,
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
  const [effectTriggered, setEffectTriggered] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(
    apiRegsiterEventData ? 0 : 0
  );

  const setDefaultSlide = (index: number) => {    
    /* istanbul ignore next */
    carouselRef.current.goToSlide(index);
  };

  useEffect(() => {
    const datetime = (text: string): string =>
    text.split('T')[1];  
   
      if(apiRegsiterEventData !=null && apiRegsiterEventData.length>0)
      {
        if (carouselRef && carouselRef.current && !effectTriggered) {
        const Index=apiRegsiterEventData.findIndex((x)=>{
          if(x.startDateTime!=null && x.endDateTime!=null){
          
            const formattedLocalTime=new Date();
            const currentUTCDateTime=formattedLocalTime.toISOString();            
           return ((datetime(x.startDateTime) <= datetime(currentUTCDateTime)  && datetime(currentUTCDateTime) <= datetime(x.endDateTime)) || datetime(x.startDateTime) > datetime(currentUTCDateTime))
          }  
          return -1;
          })
       
        setEffectTriggered(true);
        if(Index <0)
        {setDefaultSlide(apiRegsiterEventData.length);
          setCurrentSlide(apiRegsiterEventData.length-1)
        }        
      else 
      {setDefaultSlide(Index);
        if((apiRegsiterEventData.length-Index)<=3)
        setCurrentSlide(apiRegsiterEventData.length-1)
      else
      setCurrentSlide(Index);
      }      
      }     
    }
  });

  const nextSlide = () => {    
    /* istanbul ignore next */
    const totallength=apiRegsiterEventData?apiRegsiterEventData.length:0;
    if (carouselRef.current) {     
      carouselRef.current.next();
      setCurrentSlide((prevSlide) => (prevSlide + 3)>  totallength? (totallength-1):(prevSlide + 3)
      );
    }
  };

  const previousSlide = () => {
    if (carouselRef.current && currentSlide > 0) {
      carouselRef.current.previous();
      setCurrentSlide((prevSlide) =>  (prevSlide - 3)<=0 ? 0 : (prevSlide - 3)
      );
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TakeRegistersLinkview />
        <div
          style={{
            display: "flex",
            marginRight: "6px",
          }}
          className="register-icon"
        >
          <div>
            <Button
              className="base-class"
              iconColor={IconColor.Neutral800}
              dataTestId="btn-previous"
              color={ButtonColor.Utility}
              iconName="chevron--left"
              onClick={previousSlide}
              size={ButtonSize.Small}
              type="button"
              disabled={apiRegsiterEventData==null?true:currentSlide === 0}
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
              disabled={apiRegsiterEventData==null?true:
                currentSlide === (apiRegsiterEventData?.length ?? 0) - 1
              }
            />
          </div>
        </div>
      </div>

      <div className="slider-div">
        {apiError === false && apiRegsiterEventData &&  apiRegsiterEventData.length > 0?   (
          <Carousel
            ref={carouselRef}
            slidesToSlide={4}
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
            {
            apiRegsiterEventData &&  (
              apiRegsiterEventData.map((item, index) => (
                <div key={index} className="actioncard-div">
                  <ActionCard
                    dataTestId={`test-id${index}`}
                    isTextTruncate
                    icon={<FilledGraphDataIcon />}
                    id={`action-card${index}`}
                    onClickActionCard={() => {}}
                    primaryText={
                      `${item.baseGroup.code!} ${item.isLesson ?  ` | ${  item?.room?.roomDescription!}` : ""}`                      
                    }
                    tagText={item.isCompleted ? "Completed" : "Ready"}
                    isShowTag
                    tagColor={
                      item.isCompleted ? TagColor.Success : TagColor.Outstanding
                    }
                  />
                </div>
              ))
            )
            }
            { apiRegsiterEventData.length > 0 &&
              <div className="actioncard-div noregister">
                <ActionCard
                  dataTestId="test-id"
                  icon={<></>}
                  id="no-more-register-id"
                  onClickActionCard={ () => {}}
                  primaryText="No more registers"
                />
              </div>
              }
          </Carousel>
        ): (         
          <div className="carousel-container carousel-item-padding-40-px actioncard-div noregister">
            <ActionCard
              dataTestId="test-id1"
              icon={<></>}
              id="no-register-id"
              onClickActionCard={() => {}}
              primaryText="No registers today"
            />
          </div>
          
        )}
      </div>
    </>
  );
};
export default TakeRegisterEventView;
