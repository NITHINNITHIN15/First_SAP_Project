using {
  Currency,
  managed,
  cuid,
  sap
} from '@sap/cds/common';

namespace sap.capire.bookshop;

entity Books : managed, cuid {
  title    : localized String(111)  @mandatory;
  descr    : localized String(1111);
  author   : Association to Authors @mandatory;
  genre    : Association to Genres;
  stock    : Integer;
  price    : Decimal;
  currency : Currency;
}

entity Authors : managed, cuid {
  name         : String(111) @mandatory;
  dateOfBirth  : Date;
  dateOfDeath  : Date;
  placeOfBirth : String;
  placeOfDeath : String;
  books        : Association to many Books
                   on books.author = $self;
}

entity Projects : cuid {
  projectName : String(150);
  startDate   : Date;
  endDate     : Date;
  employees   : Association to many Employees on employees.project = $self;
  // tasks       : Association to many Tasks on tasks.project = $self;
}

entity Employees : cuid {
  name        : String(100);
  designation : String(100);
  email       : String(100);
  tasks       : Association to many Tasks on tasks.assignedTo = $self;
  project     : Association to Projects;
}

entity Tasks : cuid {
  title       : String(150);
  description : String(500);
  status      : String(20);
  virtual criticality : Integer;
  dueDate     : Date;
  assignedTo  : Association to Employees;
  project     : Association to Projects;
}





/** Hierarchically organized Code List for Genres */
entity Genres : sap.common.CodeList {
  key ID       : Integer;
      parent   : Association to Genres;
      children : Composition of many Genres
                   on children.parent = $self;
}
