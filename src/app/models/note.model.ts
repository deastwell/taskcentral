import { DocumentData } from "@angular/fire/compat/firestore";

export interface Note extends DocumentData{
  id: string,  
  title: string;
  content: string;
    
  }