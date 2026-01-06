import React, { useState, useEffect } from "react";
import { FetchStudentsData } from "./ApiService";
import { TableWrapper, Table, TableHead, TableRow, TableCell, TableBody} from "@essnextgen/ui-kit"



interface StudentsAttendance {
  attendanceID: number;
  studentID: number;
  attendanceDate: string; 
  status: 'Present' | 'Absent';
  isExcused: boolean;
  notes?: string | null;
}

const StudentsView: React.FC = () => { 
    const [AttendanceData, setAttendanceData] = useState<StudentsAttendance[]>([]);  
    const [loading, setLoading] = useState<boolean>(true);  
    const [error, setError] = useState<string | null>(null);  

    useEffect(()=>{  
    const getData = async ()=> {  
        try{  
            const result = await FetchStudentsData(); 
            setAttendanceData(result.data);  
            console.log(setAttendanceData) 
        }catch(err:any){  
            setError("Error fetching data") 
        }finally{  
            setLoading(false); 
        }  
    } 
    getData();  
    },[]); 
  
    if(loading){ 
        return <div>Loading...</div> 
    } 
    if(error){  
        return <div>{error}</div> 
    } 
    console.log(AttendanceData); 
  return (  
    <div style={{ padding: '2rem' }}> 
      <h2>Student Attendance Management</h2> 
      <TableWrapper> 
        <Table>  
          <TableHead> 
            <TableRow> 
              <TableCell header>Attendance ID</TableCell> 
              <TableCell header>Student ID</TableCell> 
              <TableCell header>Date</TableCell> 
              <TableCell header>Status</TableCell> 
              <TableCell header>Is Excused</TableCell> 
              <TableCell header>Notes</TableCell> 
            </TableRow> 
          </TableHead> 
          <TableBody> 
            {AttendanceData.map((row: StudentsAttendance) => ( 
              <TableRow key={row.attendanceID}> 
                <TableCell>{row.attendanceID}</TableCell> 
                <TableCell>{row.studentID}</TableCell> 
                <TableCell>{row.attendanceDate ? row.attendanceDate.split('T')[0] : ''}</TableCell> 
                <TableCell>{row.status}</TableCell> 
                <TableCell>{row.isExcused ? "True" : "False"}</TableCell> 
                <TableCell>{row.notes ? row.notes : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </div>
  );
};

export default StudentsView