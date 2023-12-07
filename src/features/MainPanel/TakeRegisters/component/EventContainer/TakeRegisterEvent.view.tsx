import React, {useRef, useEffect,useState } from "react";
import Carousel from "react-multi-carousel";
import {
  ActionCard,
  Button,
  ButtonColor,
  ButtonSize,
  IconColor,
  Loader,
  LoaderType,
  TagColor
} from "@essnextgen/ui-kit";
import { IRegisterViewProps } from "./props";
import TakeRegistersLinkview from "../TakeRegisterLink/TakeRegisterLink.view";
import "./carousalstyle.scss";
import { responsive } from "./carousel";
import { envConfig } from "../../../../../shared/utils";
import { IRegistersDetails } from "../../../../../shared/model/RegisterDomain/responsemodels";

const TakeRegisterEventView: React.FC<IRegisterViewProps> = ({
  apiRegsiterEventData,
  apiError,
  isLoader
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
   
      if(apiRegsiterEventData !=null && apiRegsiterEventData.length>0)
      {
        if (carouselRef && carouselRef.current && !effectTriggered) {
        const Index=apiRegsiterEventData.findIndex((x)=>{
          if(x.eventStart!=null && x.eventEnd!=null){         
            const formattedLocalTime=new Date();
            const currentUTCDateTime=formattedLocalTime.toISOString().split('.')[0]; 
            return ((Date.parse(x.eventStart) <= Date.parse(currentUTCDateTime)  && Date.parse(currentUTCDateTime) <= Date.parse(x.eventEnd)) || Date.parse(x.eventStart) > Date.parse(currentUTCDateTime))            
          }  
          return -1;
          })
          
        setEffectTriggered(true);
        if(Index <0)
        {setDefaultSlide(apiRegsiterEventData.length);
          setCurrentSlide(apiRegsiterEventData.length-1)
        }        
      else 
      {
        setDefaultSlide(Index);
        if((apiRegsiterEventData.length-Index)<=3)
        setCurrentSlide(apiRegsiterEventData.length-1)
      else
      setCurrentSlide(Index);
      }      
      }     
    }
    
  });

  const nextSlide = () => {
    if (carouselRef.current) { 
       /* istanbul ignore next */    
      carouselRef.current.next();
      setTimeout(moveRight,1000)     
      
    }
  };
  const moveRight=()=>{
    const totallength=apiRegsiterEventData?apiRegsiterEventData.length:0;
    setCurrentSlide((prevSlide) => (prevSlide + 3)>  totallength? (totallength-1):(prevSlide + 3))
  }
  const moveLeft=()=>{    
    setCurrentSlide((prevSlide) =>  (prevSlide - 3)<=0 ? 0 : (prevSlide - 3)
    );
  }

  const previousSlide = () => {
     /* istanbul ignore next */
    if (carouselRef.current && currentSlide > 0) {
      carouselRef.current.previous();
      setTimeout(moveLeft,1000)
     
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

  const OnRegisterClick = (item: IRegistersDetails) => {

    const url = (item.eventTypeCode === "AttendanceSession")
    ? `${envConfig.REGISTER_BASE_URL}/take-register/${item.eventDescription}/${item.group.externalId}/${item.eventInstanceExternalId}`
    : `${envConfig.REGISTER_BASE_URL}/take-register/${item.classPeriodExternalId}/${item.group.externalId}/${item.eventInstanceExternalId}`;
  window.open(url, "_self");
  };
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
              disabled={apiRegsiterEventData==null?true:(currentSlide === 0 || apiRegsiterEventData?.length<4)}
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
                (currentSlide === (apiRegsiterEventData?.length ?? 0) - 1) || (currentSlide +3 >= apiRegsiterEventData?.length)
              }
            />
          </div>
        </div>
      </div>

      <div>

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
           {isLoader ? (
              <Loader
                data-testid="data-loader"
                className="loader-wrapper"
                loaderText="Loading..."
                loaderType={LoaderType.Circular}
              />
            ) : (
              apiRegsiterEventData &&
              apiRegsiterEventData.map((item, index) => (
                <div key={index} className="actioncard-div">
                  <ActionCard
                    dataTestId={`test-id${index}`}
                    isTextTruncate
                    icon={<FilledGraphDataIcon />}
                    id={`action-card${index}`}
                    onClickActionCard={() => {
                      OnRegisterClick(item);
                    }}
                    primaryText={`${item.group.shortName!} ${
                      item.room ? ` | ${item?.room?.roomName!}` : ""
                    }`}
                    tagText={item.isCompleted ? "Completed" : "Ready"}
                    isShowTag
                    tagColor={
                      item.isCompleted ? TagColor.Success : TagColor.Outstanding
                    }
                  />
                </div>
              ))
            )}
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
          apiError === false &&
          (apiRegsiterEventData == null ||
            apiRegsiterEventData.length === 0) && (
            <div className="carousel-container carousel-item-padding-40-px noregisterblock noregister ">
              <ActionCard
                dataTestId="test-id1"
                icon={<></>}
                id="no-register-id"
                onClickActionCard={() => {}}
                primaryText="No registers today"
              />
            </div>
          )
          
        )
        }
      </div>
    </>
  );
};
export default TakeRegisterEventView;
