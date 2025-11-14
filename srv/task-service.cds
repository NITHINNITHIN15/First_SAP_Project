using {sap.capire.bookshop as my} from '../db/schema';

service TaskService {
    entity Projects as projection on my.Projects;
    entity Employees as projection on my.Employees;
    entity Tasks as projection on my.Tasks;
    
    action createTask(title: String, description: String) returns Tasks;
    action submitTask(taskId : UUID) returns String;
    
}