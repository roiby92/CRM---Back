use crm_project;

-- create table owner(
--     id int not null auto_increment primary key,
--     name varchar(50) 
-- );

-- create table country(
--     id int not null auto_increment primary key,
--     name varchar(20) 
-- );

-- create table email_type(
--     id int not null auto_increment primary key,
--     type varchar(20)
-- );

-- create table client(
--     id varchar(30) not null primary key,
--     name varchar(50) not null,
--     email varchar(50) not null,
--     first_contact datetime not null,
--     email_type int ,
--     sold boolean not null ,
--     owner int,
--     country int,
--     foreign key (email_type) references email_type(id),
--     foreign key (owner) references owner(id),
--     foreign key (country) references country(id)
-- );





-- select c.id,c.name, c.email, c.first_contact as firstContact, et.type as emailType, c.sold, o.name as owner, coun.name as country
-- from client as c, email_type as et, owner as o,  country as coun
-- where c.email_type = et.id and c.owner = o.id and c.country = coun.id
-- order by c.first_contact


-- SELECT DAY(first_contact) AS day , COUNT(id) AS numOfSales
-- FROM client
-- where MONTH(first_contact)="10" AND DAY(first_contact) BETWEEN "1" AND  "30"
-- GROUP BY DAY(first_contact);
                        
update client
set${prop} = ${se}
   
-- SELECT 
-- FROM client
-- GROUP BY first_contact;