import { IGetClassDetailsProps } from "./GetClassDetailsProps";



const getClassDetails : (props:IGetClassDetailsProps)=> string =
 (props:IGetClassDetailsProps)=>{
   let classDetail: string = "";
 
   const {yearGroup, classGroup} : IGetClassDetailsProps = props;

   if ( yearGroup!== "" && classGroup !== "")
     classDetail = `${yearGroup} / ${classGroup}`;
   else if (yearGroup !== "" && classGroup === "")
     classDetail = yearGroup;
   else if (yearGroup === "" && classGroup !== "")
     classDetail = classGroup;

   return (classDetail);
 };

export default getClassDetails;