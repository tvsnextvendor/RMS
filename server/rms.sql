INSERT INTO public."Roles"("roleId", "roleName", "description", "created", "updated")
VALUES 
(DEFAULT,'NetworkAdmin', 'NetworkAdmin To Manage All Over Resorts', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT,'PeerAdmin', 'Peer Admin To Manage Users of Parent Report', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT,'Child', 'Child Resort Management',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT,'Employees', 'Employees Management',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
;


INSERT INTO public."Divisions"("divisionId", "divisionName", "created", "updated")
VALUES 
(DEFAULT,'Primary Division', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT,'Secondary Division', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT,'Teritary Division',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


INSERT INTO public."Departments"("departmentId", "departmentName","created", "updated","divisionId")
VALUES 
(DEFAULT,'HR', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,1),
(DEFAULT,'Sales', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,1),
(DEFAULT,'Admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,1),
(DEFAULT,'Security', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,2),
(DEFAULT,'Admin Section', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,2),
(DEFAULT,'Tech', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,2);



INSERT INTO public."Designations"("designationId", "designationName","default","created", "updated")
VALUES 
(DEFAULT,'CEO', true,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT,'CIO', true,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT,'HR', true,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT,'Operations', true,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT,'COO',true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT,'Director', true,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT,'Supervisor',true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT,'Manager',true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT,'VP',true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(DEFAULT,'President',true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);