外键约束下删除表数据;
SET foreign_key_checks = 0;
清空表 truncate table table_name;
SET foreign_key_checks = 1;


create database studentmanage;
use studentmanage;
create table student(
	s_id int auto_increment primary key,
	s_name varchar(15),
	gender int,
	enrollmentdate int,
	number int,
	college varchar(50),
	major varchar(40)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table teauser(
	s_id int auto_increment primary key,
	name varchar(15),
	password int,
	number int
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table course(
	c_id int auto_increment primary key,
	c_title varchar(30),
	introduction varchar(30),
	max int
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table enrollments(
	e_id int auto_increment primary key,
	studentId int,
	courseId  int,
	done int,
	grade int,
	foreign key(studentId) references student(s_id),
	foreign key(courseId) references course(c_id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into student(s_name,gender,enrollmentdate,number,college,major) values('aaa',0,2016,162014001,'电软系','通信工程'),('bbb',1,2016,162011001,'电软系','计算机');
insert into course (c_title,introduction) values('大物','这是大物'),('高数','这是高数'),('大英','这是大英');
insert into enrollments (studentId,courseId,done) values (1,1,0),(1,2,0),(1,3
,0),(2,1,0),(2,2,0),(2,3,0);
insert into teauser(name,password,number) values('王老师',123123,123123);


