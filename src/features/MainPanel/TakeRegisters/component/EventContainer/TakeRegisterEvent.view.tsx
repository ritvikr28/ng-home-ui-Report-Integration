  import React, { useRef, useEffect, useState } from "react";
  import {
    Button,
    ButtonColor,
    ButtonSize,
    Grid,
    GridItem,
    IconColor,
    useMediaQuery
  } from "@essnextgen/ui-kit";
  import {
    useTranslation,
    UseTranslationResponse
  } from "@essnextgen/ui-intl-kit";
  import { IRegisterViewProps } from "./props";

  import "./carousalstyle.scss";
  import { responsive, iscloseresponsive } from "./carousel";
  import {
    envConfig
  } from "../../../../../shared/utils";
  import { SectionTitle } from "../../../../../shared/components/SectionTitle/SectionTitle";
  import { handleRegisterClick, isButtonDisabled, nextSlide, previousSlide, renderCarousel, renderNoRegisterMessage, setDefaultAndCurrentSlide, filterAndSortRegisterData, getShowRegisterSecondaryTextFlag } from "./TakeRegisterEventHelper";
import { IRegistersDetails } from "../../../../../shared/model/RegisterDomain/responsemodels";

  const TakeRegisterEventView: React.FC<IRegisterViewProps> = ({
    apiRegsiterEventData,
    apiError,
    isOpen
  }: IRegisterViewProps): JSX.Element => {
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();
    const carouselRef: any = useRef(null);
    const [effectTriggered, setEffectTriggered]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
    const [currentSlide, setCurrentSlide]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(apiRegsiterEventData && apiRegsiterEventData.length > 0 ? 0 : 0);
    const [carouselData, setCarouselData]: [typeof responsive, React.Dispatch<React.SetStateAction<typeof responsive>>] = useState<typeof responsive>(responsive);

    const filteredAndSortedData: IRegistersDetails[] | null = React.useMemo(() => 
      getShowRegisterSecondaryTextFlag()
        ? filterAndSortRegisterData(apiRegsiterEventData || [])
        : (apiRegsiterEventData || [])
      , [apiRegsiterEventData]);

    useEffect(() => {
      /* eslint-disable */
      setCarouselData(isOpen ? responsive : iscloseresponsive);
    }, [isOpen]);

    /* eslint-enable */

    const isMediumscreen: boolean = useMediaQuery("(min-width:1439.9px)");
    useEffect(() => {
      if (!filteredAndSortedData?.length || effectTriggered || !carouselRef?.current) return;

      setEffectTriggered(true);

      setDefaultAndCurrentSlide(
        carouselRef,
        filteredAndSortedData,
        setCurrentSlide
      );
    }, [filteredAndSortedData, effectTriggered]);

    return (
      <>
        <Grid className="register-icon">
          <GridItem sm={9} lg className="c-clear-padding">
            <SectionTitle
              title={t("takeRegister.takeregisterlink")}
              hasLink
              linkText={t("takeRegister.takeregistertext")}
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
              onClick={() => previousSlide(carouselRef, currentSlide, setCurrentSlide)}
              size={ButtonSize.Small}
              type="button"
              /* eslint-disable */
              disabled={isButtonDisabled(
                "previous",
                filteredAndSortedData ?? null,
                currentSlide
              )}
            /* eslint-enable */
            />
            <Button
              className="base-class"
              iconColor={IconColor.Neutral800}
              dataTestId="btn-next"
              color={ButtonColor.Utility}
              iconName="chevron--right"
              ariaLabel="carousel-right-btn"
              onClick={() => nextSlide(carouselRef, filteredAndSortedData ?? null, setCurrentSlide)}
              size={ButtonSize.Small}
              type="button"
              /* eslint-disable */
              disabled={isButtonDisabled(
                "next",
                filteredAndSortedData ?? null,
                currentSlide
              )}
            />
          </GridItem>
        </Grid>
        <div>
          {apiError === false &&
            (filteredAndSortedData.length > 0
              ? renderCarousel(
                  filteredAndSortedData,
                  isMediumscreen,
                  carouselRef,
                  carouselData,
                  handleRegisterClick,
                  t
                )
              : renderNoRegisterMessage(t))}
        </div>
        
      </>
    );
  };

  export default TakeRegisterEventView;
