ALTER DATABASE msis CHARACTER SET utf8 COLLATE utf8_general_ci;

ALTER TABLE modules CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE modules_co_requisites CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE modules_pass_requisites CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE modules_read_requisites CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE roles CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE student_module_grades CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE user_roles CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE users CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;