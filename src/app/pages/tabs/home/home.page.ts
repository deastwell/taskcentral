import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateTaskComponent } from 'src/app/shared/components/add-update-task/add-update-task.component';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user = {} as User
  tasks: Task[] = []
  loading: boolean = false;
  allTasks: Task[] = [];

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private alertCtrl: AlertController 
  ) { }

  ngOnInit() {
  
  }

  ionViewWillEnter() {
    this.getTasks()
    this.getUser()
  }


 getUser() {
    return this.user = this.utilsSvc.getElementFromLocalStorage('user')
  }

  getPercentage(task: Task) {
    return this.utilsSvc.getPercentage(task)
  }


 async addOrUpdateTask(task?: Task) {
   let res = await this.utilsSvc.presentModal({
      component: AddUpdateTaskComponent,
      componentProps: { task },
      cssClass: 'add-update-modal'
    })

    if(res && res.success){
      this.getTasks()
    }
  }


  getTasks() {
    console.log('Fetching tasks...');
    let user: User = this.utilsSvc.getElementFromLocalStorage('user');
    let path = `users/${user.uid}`;

    this.loading = true;
    let sub = this.firebaseSvc.getSubcollection(path, 'tasks').subscribe({
      next: (res: Task[]) => {
        console.log('Tasks retrieved:', res);
        this.tasks = res;
        this.allTasks = [...res]; // Store all tasks
        sub.unsubscribe();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
        this.loading = false;
      }
    });
  }



  confirmDeleteTask(task: Task){
    this.utilsSvc.presentAlert({
      header: 'Eliminar tarea',
      message: '¿Quieres eliminar esta tarea?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
         
        }, {
          text: 'Si, eliminar',
          handler: () => {
          this.deleteTask(task)
          }
        }
      ]
    })
  }

  deleteTask(task: Task) {
    let path = `users/${this.user.uid}/tasks/${task.id}`;

    this.utilsSvc.presentLoading();

    this.firebaseSvc.deleteDocument(path).then(res => {

      this.utilsSvc.presentToast({
        message: 'Tarea eliminada exitosamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      })

      this.getTasks()
      this.utilsSvc.dismissLoading()
    }, error => {

      this.utilsSvc.presentToast({
        message: error,
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      })

      this.utilsSvc.dismissLoading()

    })
  }


  async openFilterSortOptions() {
    const alert = await this.alertCtrl.create({
      header: 'Filtrar tareas',
      inputs: [
        {
          name: 'showAll',
          type: 'radio',
          label: 'Show All',
          value: 'all',
          checked: true
        },
        {
          name: 'sortCompleted',
          type: 'radio',
          label: 'Completed',
          value: '99.9-100'
        },
        {
          name: 'filter25',
          type: 'radio',
          label: '0-25%',
          value: '0-25'
        },
        {
          name: 'filter50',
          type: 'radio',
          label: '25-50%',
          value: '25-50'
        },
        {
          name: 'filter75',
          type: 'radio',
          label: '50-75%',
          value: '50-75'
        },
        {
          name: 'filter100',
          type: 'radio',
          label: '75-100%',
          value: '75-100'
        },
        {
          name: 'sortAsc',
          type: 'radio',
          label: 'Ascending',
          value: 'asc'
        },
        {
          name: 'sortDesc',
          type: 'radio',
          label: 'Descending',
          value: 'desc'
        },
        
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Apply',
          handler: (data) => {
            console.log('Selected filter/sort option:', data);
            this.applyFilterSort(data);
          },
        },
      ],
    });

    await alert.present();
  }


  applyFilterSort(option: string) {
    console.log('Applying filter/sort option:', option);
    if (option === 'all') {
      this.tasks = [...this.allTasks]; // Show all tasks
    } else if (option.includes('-')) {
      this.filterTasks(option);
    } else {
      this.sortTasks(option);
    }
  }

  filterTasks(range: string) {
    const [min, max] = range.split('-').map(Number);
    console.log(`Filtering tasks with progress between ${min}% and ${max}%`);
    this.tasks = this.allTasks.filter(task => {
      const percentage = this.getPercentage(task);
      return percentage >= min && percentage <= max;
    });
    console.log('Filtered tasks:', this.tasks);
  }

  sortTasks(order: string) {
    console.log(`Sorting tasks in ${order} order`);
    this.tasks.sort((a, b) => {
      const aPercentage = this.getPercentage(a);
      const bPercentage = this.getPercentage(b);
      return order === 'asc' ? aPercentage - bPercentage : bPercentage - aPercentage;
    });
    console.log('Sorted tasks:', this.tasks);
  }




}
