var express = require('express');
var app = express();
var mysql = require('mysql');
var querystring = require('querystring');
var util = require('util');
var connection,studentData1,studentData2,courseData1,courseData2,enrollmentData,studentCourseData,studentCourses,selectCourses;
var that = this;
// var Students=[],Courses=[],Enrollments=[],CoursesNum;
function openConnection(){
    connection = mysql.createConnection({
        host: '127.0.0.1',
        user:'root',
        password:'admin',
        database:'studentmanage'
    });
    connection.connect();
}
function closeConnection(){
    connection.end();
}
function selectedStu(){
    openConnection();
    let sql1 = 'select * from student,enrollments,course where student.s_id = enrollments.studentId and course.c_id = enrollments.courseId order by student.s_id asc;';
   connection.query(sql1,function(err,res){
    if(err){
        console.error(err);
        return;
    }
    else {
        let dataString = JSON.stringify(res)
        studentData1 = JSON.parse(dataString);
        
    }
   })
    closeConnection();
    openConnection();
    let sql2 = 'select * from student left join enrollments on student.s_id=enrollments.studentId where enrollments.studentId is null;';
   connection.query(sql2,function(err,res){
    if(err){
        console.error(err);
        return;
    }
    else {
        let dataString = JSON.stringify(res)
        studentData2 = JSON.parse(dataString)
        
    }
   })
    closeConnection();
}
function selectedCors(){
    openConnection();
    let sql = 'select * from course,enrollments where course.c_id = courseId order by course.c_id asc;';
    connection.query(sql,function(err,res){
    if(err){
        console.error(err);
    }
    else{
        let dataString = JSON.stringify(res)
        courseData1 = JSON.parse(dataString);
        
    }
    })
    closeConnection();
    openConnection();
    let sql2 = 'select * from course left join enrollments on course.c_id=enrollments.courseId where enrollments.courseId is null;';
   connection.query(sql2,function(err,res){
    if(err){
        console.error(err);
        return;
    }
    else {
        let dataString = JSON.stringify(res)
        courseData2 = JSON.parse(dataString)
        
    }
   })
    closeConnection();
}
// function selectedEnrol(){
//     openConnection();
//     let sql = "select * from enrollments;";
//     connection.query(sql,function(err,res){
//         if(err){
//             console.error(err)
//         }
//         else{
//             let dataString = JSON.stringify(res);
//             enrollmentData = JSON.parse(dataString);
//         }
//     })
//     closeConnection();
// }
function selectStudentCors(sid){
    return new Promise((resolve,reject)=>{
        openConnection();
        let sql = " select * from student left join enrollments on student.s_id=enrollments.studentId left join course on enrollments.courseId = course.c_id where student.s_id="
        +parseInt(sid)+";";
        connection.query(sql,function(err,res){
        if(err){
            console.error(err)
            reject()
        }
        else{
            let dataString = JSON.stringify(res)
            studentCourseData = JSON.parse(dataString);
            // console.log(studentCourseData)
            resolve()
            }
            })
            closeConnection();
            
    })
    
    
}
function stuCourse(){
    let studentCourse=[];
    return new Promise((resolve,reject)=>{
        for(let i=0;i<studentCourseData.length;i++){
            let cors = {
                Title:studentCourseData[i].c_title,
                Cid:studentCourseData[i].c_id
            }
            studentCourse.push(cors)
            studentCourses = [...new Set(studentCourse)]
         }
         resolve(studentCourses)
       
        //  console.log(studentCourses)
    })
    
}
function selectCourse(studentCourses,courseData){
    return new Promise((resolve,reject)=>{
        let selectCOurse=[]
        var Course = [];
        var courseData = courseData1.concat(courseData2);
        for(let i=0;i<courseData.length;i++){
            for(let j=0;j<courseData.length;j++){
                if(courseData[i].s_id==courseData[j].s_id){
                 var Ss = Course.find(item=> item.Id === courseData[i].c_id);
                 if(Ss){
                     if(Ss.Enrollments!=undefined){
                         Ss.Enrollments.push({
                         Id:courseData[i].e_id,
                         StudentId:courseData[i].studentId,
                         CourseId:courseData[i].courseId,
                         Done:courseData[i].done,
                         Grade:courseData[i].grade
                     })
                     }
                     else{
                         Ss.Enrollments= new Array({
                         Id:courseData[i].e_id,
                         StudentId:courseData[i].studentId,
                         CourseId:courseData[i].courseId,
                         Done:courseData[i].done,
                         Grade:courseData[i].grade
                         })
                     }
                     Course.push(Ss)
                 }
                 else{
                     let Enrollments=[];
                     if(courseData[i].e_id!=null){
                         Enrollments.push({
                             Id:courseData[i].e_id,
                             StudentId:courseData[i].studentId,
                             CourseId:courseData[i].courseId,
                             Done:courseData[i].done,
                             Grade:courseData[i].grade
                         })
                     }
                    
                     let newCor = {
                         Id:courseData[i].c_id,
                         Title:courseData[i].c_title,
                         Introduction:courseData[i].introduction,
                         Max:courseData[i].max,
                         Enrollments:Enrollments
                     }
                     
                     Course.push(newCor)
                     var Courses=[...new Set(Course)]
                     selectCOurse=Array.from(Courses) 
                 }
         
                 break;
                
                }
              
            }
         }
         console.log('courses',Courses)
         console.log('stucourses',studentCourses)
         for(let i=0;i<Courses.length;i++){
             for(let j=0;j<studentCourses.length;j++){
                if(Courses[i].Id==studentCourses[j].Cid){
                    delete selectCOurse[i]
                    
                    // // console.log('Courses',Courses)
                    // continue
                    // selectCOurse=Courses
                    // selectCourses = [...new Set(selectCOurse)]

                }
               
             }
           
         }
        let resols=[];
        selectCOurse.forEach(res=>{
            if(res!=undefined){
                resols.push(res)
            }
        })
        resolve(resols)



    })
}
function corsNum(){
    openConnection();
    let sql = 'select count(distinct courseId) as count from enrollments;';
    connection.query(sql,function(err,res){
        if(err){
            console.error(err)
        }
        else{
           
            let dataString = JSON.stringify(res)
            CoursesNum = JSON.parse(dataString)[0].count
            // console.log(CoursesNum)
        }
    })
    closeConnection();
}
selectedStu();
selectedCors();
// selectedEnrol();
corsNum();
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
    
app.get('/Students',function(req,res){
    var Student = [];
    var studentData = studentData1.concat(studentData2);
    // console.log(studentData)
    for(let i=0;i<studentData.length;i++){
       for(let j=0;j<studentData.length;j++){
           if(studentData[i].s_id==studentData[j].s_id){
            var Ss = Student.find(item=> item.Id === studentData[i].s_id);
            if(Ss){
                if(Ss.Enrollments!=undefined){
                    Ss.Enrollments.push({
                    Id:studentData[i].e_id,
                    StudentId:studentData[i].studentId,
                    CourseId:studentData[i].courseId,
                    Grade:studentData[i].grade,
                    Done:studentData[i].done,
                    CourseName:studentData[i].c_title
                })
                }
                else{
                    Ss.Enrollments= new Array({
                    Id:studentData[i].e_id,
                    StudentId:studentData[i].studentId,
                    CourseId:studentData[i].courseId,
                    Grade:studentData[i].grade,
                    Done:studentData[i].done,
                    CourseName:studentData[i].c_title
                    })
                }
                Student.push(Ss)
            }
            else{
                let Enrollments=[];
                if(studentData[i].e_id!=null){
                    Enrollments.push({
                        Id:studentData[i].e_id,
                        StudentId:studentData[i].studentId,
                        CourseId:studentData[i].courseId,
                        Grade:studentData[i].grade,
                        Done:studentData[i].done,
                        CourseName:studentData[i].c_title
                    })
                }
               
                let newStu = {
                    Id:studentData[i].s_id,
                    Name:studentData[i].s_name,
                    Gender:studentData[i].gender,
                    EnrollmentDate:studentData[i].enrollmentdate,
                    Number:studentData[i].number,
                    College:studentData[i].college,
                    Major:studentData[i].major,
                    Enrollments:Enrollments
                }
                Student.push(newStu)
                var Students=[...new Set(Student)]
                
            }
    
            break;
           
           }
         
       }
    }
    // console.log(typeof(Students))
    // console.log(Students)

    res.send(Students);
})
app.get('/Courses',function(req,res){
    var Course = [];
    var courseData = courseData1.concat(courseData2);
    for(let i=0;i<courseData.length;i++){
       for(let j=0;j<courseData.length;j++){
           if(courseData[i].s_id==courseData[j].s_id){
            var Ss = Course.find(item=> item.Id === courseData[i].c_id);
            if(Ss){
                if(Ss.Enrollments!=undefined){
                    Ss.Enrollments.push({
                    Id:courseData[i].e_id,
                    StudentId:courseData[i].studentId,
                    CourseId:courseData[i].courseId,
                    Done:courseData[i].done,
                    Grade:courseData[i].grade
                })
                }
                else{
                    Ss.Enrollments= new Array({
                    Id:courseData[i].e_id,
                    StudentId:courseData[i].studentId,
                    CourseId:courseData[i].courseId,
                    Done:courseData[i].done,
                    Grade:courseData[i].grade
                    })
                }
                Course.push(Ss)
            }
            else{
                let Enrollments=[];
                if(courseData[i].e_id!=null){
                    Enrollments.push({
                        Id:courseData[i].e_id,
                        StudentId:courseData[i].studentId,
                        CourseId:courseData[i].courseId,
                        Done:courseData[i].done,
                        Grade:courseData[i].grade
                    })
                }
               
                let newCor = {
                    Id:courseData[i].c_id,
                    Title:courseData[i].c_title,
                    Introduction:courseData[i].introduction,
                    Max:courseData[i].max,
                    Enrollments:Enrollments
                }
                
                Course.push(newCor)
                var Courses=[...new Set(Course)]
                
            }
    
            break;
           
           }
         
       }
    }
    res.send(Courses)
})
app.get('/Enrollments/:sid',function(req,res){
    
    selectStudentCors(req.params.sid).then(()=>{
        stuCourse().then(()=>res.send(studentCourses))
       }).catch(err=>{
           console.log(err)
       })
    
})
app.get('/selectCourses/:sid',function(req,result){
    var Course = [];
    var courseData = courseData1.concat(courseData2);
    selectStudentCors(req.params.sid).then(()=>{
        stuCourse().then((res)=>selectCourse(res,courseData).then((selectCourses)=>result.send(selectCourses)))
       }).catch(err=>{
           console.log(err)
       })

    // res.send(selectCourses)
})
app.post('/Students/create',function(req,res){
    let post = '';
    var that = this
    req.on('data', function (chunk) {
        post += chunk;
    });
    req.on('end', function () {
        // post = util.inspect(querystring.parse(post));
        post = querystring.parse(post)
        // console.log(post)
        // console.log(typeof(post))
        openConnection();
        let sql = "insert into student (s_name,gender,enrollmentdate,number,college,major) values ('"+
        post.Name+"',"+
        parseInt(post.Gender)+","+
        parseInt(post.EnrollmentDate)+","+
        parseInt(post.Number)+",'"+
        post.College+"','"+
        post.Major+
        "');";
    connection.query(sql,function(err,res){
        if(err){
            console.error(err)
        }
        else{
            //  console.log(res)
             selectedStu()
        }
    })
    closeConnection();
    openConnection();
        let sql2 = "insert into stuuser (name,password,number) values ('"+
        post.Name+"','666666',"+
        parseInt(post.Number)+
        ");";
    connection.query(sql2,function(err,res){
        if(err){
            console.error(err)
        }
        else{
            //  console.log(res)
             selectedStu()
        }
    })
    closeConnection();

    });
    
    res.end()
})
app.post('/Students/createstus',function(req,res){
    let post = '';
    var that = this
    req.on('data', function (chunk) {
        post += chunk;
    });
    req.on('end', function () {
        // post = util.inspect(querystring.parse(post));
        // post = querystring.parse(post)
        post = JSON.parse(post)
        console.log(post)
        // console.log(typeof(post))
        let stusql='',stusql2=''
        
        for(let i=0;i<post.length;i++){
            if(i<post.length-1){
               stusql+="('"+post[i].name+"','"+post[i].sex+"',"+post[i].year+","+post[i].number+",'"+post[i].college+"','"+post[i].major+"')," ;
               stusql2+="('"+post[i].name+"',666666,"+post[i].number+"),"
            }
            else if(i==post.length-1){
                stusql+="('"+post[i].name+"','"+post[i].sex+"',"+post[i].year+","+post[i].number+",'"+post[i].college+"','"+post[i].major+"');" ;
                stusql2+="('"+post[i].name+"',666666,"+post[i].number+");"
            }   
        }
        console.log(stusql2)
        openConnection();
        let sql = "insert into student (s_name,gender,enrollmentdate,number,college,major) values "+stusql;
     connection.query(sql,function(err,res){
        if(err){
            console.error(err)
        }
        else{
            
             selectedStu()
        }
    })
    closeConnection();
    openConnection();
        let sql2 = "insert into stuuser (name,password,number) values "+stusql2;
    connection.query(sql2,function(err,res){
        if(err){
            console.error(err)
        }
        else{
           
             selectedStu()
        }
    })
    closeConnection();

    });
    
    res.end()
})
app.post('/Courses/createlessons',function(req,res){
    let post = '';
    var that = this
    req.on('data', function (chunk) {
        post += chunk;
    });
    req.on('end', function () {
        // post = util.inspect(querystring.parse(post));
        // post = querystring.parse(post)
        post = JSON.parse(post)
        console.log(post)
        // console.log(typeof(post))
        let stusql=''
        for(let i=0;i<post.length;i++){
            if(i<post.length-1){
               stusql+="('"+post[i].title+"','"+post[i].introduction+"',"+post[i].max+")," ;
              
            }
            else if(i==post.length-1){
                stusql+="('"+post[i].title+"','"+post[i].introduction+"',"+post[i].max+");" ;
                
            }   
        }
        console.log(stusql)
        openConnection();
        let sql = "insert into course (c_title,introduction,max) values "+stusql;
     connection.query(sql,function(err,res){
        if(err){
            console.error(err)
        }
        else{
            selectedCors()
        }
    })
    closeConnection();
    
    });
    
    res.end()
})
app.post('/Students/Edit',function(req,res){
    let post = '';
    var that = this
    req.on('data', function (chunk) {
        post += chunk;
    });
    req.on('end', function () {
        // post = util.inspect(querystring.parse(post));
        post = querystring.parse(post)
        console.log(post)
        console.log(typeof(post))
        openConnection();
        let sql = "update student set s_name='"+post.Name+"',gender="+parseInt(post.Gender)+",enrollmentdate="
        +parseInt(post.EnrollmentDate)+",number="+parseInt(post.Number)+",college='"+post.College+"',major='"+
        post.Major+"' where number="+parseInt(post.Flag)+";";
        connection.query(sql,function(err,res){
        if(err){
            console.error(err)
        }
        else{
            selectedStu()
            //  console.log(res)
        }
    })
    closeConnection();

    });
    
    res.end()
})
app.post('/Students/Delete',function(req,res){
    let post = '';
    var that = this;
    // console.log(req)
    req.on('data', function (chunk) {
        post += chunk;
    });
    req.on('end', function () {
        // post = util.inspect(querystring.parse(post));
        post = querystring.parse(post)
        console.log(post)
        openConnection();
    let sql2 = "delete from enrollments where studentId="+parseInt(post.studentId)+";";
    connection.query(sql2,function(err,res){
    if(err){
        console.error(err)
    }
    else{
        selectedStu()
        selectedCors()
        
    }
})
closeConnection();
        openConnection();
        let sql = "delete from student where number="+parseInt(post.number)+";";
        connection.query(sql,function(err,res){
        if(err){
            console.error(err)
        }
        else{
            selectedCors()
            selectedStu()
            
        }
    })
    closeConnection();
    openConnection();
    let sql3 = "delete from stuuser where number="+parseInt(post.number)+";";
    connection.query(sql3,function(err,res){
    if(err){
        console.error(err)
    }
    else{
        selectedCors()
        selectedStu()
        
    }
})
closeConnection();
    

    });
    
    res.end()
})
app.post('/Students/courseEdit',function(req,res){
    let post = '';
    var that = this
    req.on('data', function (chunk) {
        post += chunk;
    });
    req.on('end', function () {
        // post = util.inspect(querystring.parse(post));
        post = querystring.parse(post)
        openConnection();
        let sql = "update enrollments set done=1,grade="+parseInt(post.grade)+
        " where studentId="+parseInt(post.studentId)+" and courseId="+parseInt(post.courseId)+";";
        connection.query(sql,function(err,res){
        if(err){
            console.error(err)
        }
        else{
            selectedStu()
            //  console.log(res)
        }
    })
    closeConnection();

    });
    
    res.end()
})
app.post('/Students/courseDelete',function(req,res){
    let post = '';
    var that = this;
    // console.log(req)
    req.on('data', function (chunk) {
        post += chunk;
    });
    req.on('end', function () {
        // post = util.inspect(querystring.parse(post));
        post = querystring.parse(post)
        openConnection();
        let sql = "delete from enrollments where studentId="+parseInt(post.studentId)+" and courseId="+parseInt(post.courseId)+";";
        connection.query(sql,function(err,res){
        if(err){
            console.error(err)
        }
        else{
            selectedCors()
            selectedStu()
            
        }
    })
    closeConnection();

    });
    
    res.end()
})
app.post('/Courses/create',function(req,res){
    let post = '';
    var that = this
    req.on('data', function (chunk) {
        post += chunk;
    });
    req.on('end', function () {
        // post = util.inspect(querystring.parse(post));
        post = querystring.parse(post)
        console.log(post)
        // console.log(typeof(post))
        openConnection();
        let sql = "insert into course (c_title,introduction,max) values ('"+
        post.Title+"','"+
        post.Introduction+"',"+
        parseInt(post.Max)+
        ");";
    connection.query(sql,function(err,res){
        if(err){
            console.error(err)
        }
        else{
            //  console.log(res)
            selectedCors()
            selectedStu()
        }
    })
    closeConnection();

    });
    
    res.end()
})
app.post('/Courses/Edit',function(req,res){
    let post = '';
    var that = this
    req.on('data', function (chunk) {
        post += chunk;
    });
    req.on('end', function () {
        post = querystring.parse(post)
        console.log(post)
        openConnection();
        let sql = "update course set c_title='"+post.Title+"',max="+parseInt(post.Max)+",introduction='"+post.Introduction+"'"+
        "where c_id="+parseInt(post.Id)+";";
        connection.query(sql,function(err,res){
        if(err){
            console.error(err)
        }
        else{
            selectedCors()
            //  console.log(res)
        }
    })
    closeConnection();

    });
    
    res.end()
})
app.post('/Courses/Delete',function(req,res){
    let post = '';
    var that = this;
    // console.log(req)
    req.on('data', function (chunk) {
        post += chunk;
    });
    req.on('end', function () {
        // post = util.inspect(querystring.parse(post));
        post = querystring.parse(post)
        console.log(post)
        openConnection();
    let sql2 = "delete from enrollments where courseId="+parseInt(post.courseId)+";";
    connection.query(sql2,function(err,res){
    if(err){
        console.error(err)
    }
    else{
        selectedCors()
        
    }
})
closeConnection();
        openConnection();
        let sql = "delete from course where c_id="+parseInt(post.courseId)+";";
        connection.query(sql,function(err,res){
        if(err){
            console.error(err)
        }
        else{
            selectedCors()
            
        }
    })
    closeConnection();
    

    });
    
    res.end()
})
app.post('/Enrollments/create',function(req,res){
    let post = '';
    var that = this
    req.on('data', function (chunk) {
        post += chunk;
    });
    req.on('end', function () {
        // post = util.inspect(querystring.parse(post));
        post = querystring.parse(post)
        console.log(post)
        // console.log(typeof(post))
        openConnection();
        let sql = "insert into enrollments (studentId,courseId,done,grade) values ("+
        parseInt(post.studentId)+","+
        parseInt(post.courseId)+",0,null);";
        connection.query(sql,function(err,res){
        if(err){
            console.error(err)
        }
        else{
            //  console.log(res)
            selectedCors()
            selectedStu()
        }
    })
    closeConnection();

    });
    
    res.end()
})
app.post('/Login/stu',function(req,res){
    let post = '';
    let that = this;
    let resdata={}
    req.on('data', function (chunk) {
        post += chunk;
    });
    req.on('end', function () {
        post = querystring.parse(post)
       checkstu(post).then((data)=>res.send(data))
       })
})
function checkstu(post){
    return new Promise((resolve,reject)=>{
    openConnection();
    let sql = "select * from stuuser where number="+
    parseInt(post.username)+" and password="+
    post.password+";";
    connection.query(sql,function(err,res){
    if(err){
        // that.res.send(false)
        console.log(err)
        reject()
    }
    else{
        let  datastring = JSON.stringify(res)
        let data = JSON.parse(datastring)
        resolve(data)
    }
    
})
closeConnection();
    })
   
}
app.post('/Login/tea',function(req,res){
    let post = '';
    let that = this;
    let resdata={}
    req.on('data', function (chunk) {
        post += chunk;
    });
    req.on('end', function () {
        post = querystring.parse(post)
       checktea(post).then((data)=>res.send(data))
       })
})
function checktea(post){
    return new Promise((resolve,reject)=>{
    openConnection();
    let sql = "select * from teauser where number="+
    parseInt(post.username)+" and password="+
    post.password+";";
    connection.query(sql,function(err,res){
    if(err){
        // that.res.send(false)
        console.log(err)
        reject()
    }
    else{
        let  datastring = JSON.stringify(res)
        let data = JSON.parse(datastring)
        resolve(data)
    }
    
})
closeConnection();
    })
   
}
app.listen(8004,function(){
    console.log('http://localhost:8004/Students')
})