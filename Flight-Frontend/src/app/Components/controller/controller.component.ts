import { SimulatorApiService } from './../../Services/Simulator-Service/simulator-api.service';
import { Component } from '@angular/core';
import { ConsoleService } from 'src/app/Services/Console-service/console.service';
import { UiContainerComponent } from '../ui-container/ui-container.component';
import { UiContainerService } from 'src/app/Services/ui-container-service/ui-container.service';

@Component({
  selector: 'controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
})
export class ControllerComponent {
  private readonly StartSimulatorExtraUrl = 'api/flights/RandomAction';
  private simulationIntervalId: any;

  constructor(
    private simulatorApiService: SimulatorApiService,
    private consoleService: ConsoleService,
    private uiContainerService: UiContainerService // Add this line
  ) {}

  startSimulation() {
    this.deleteAllPlanes(); // reseting data
    this.consoleService.log('Simulation started.',false);
    this.simulationIntervalId = setInterval(() => {
      this.RandomActionAPI();
    }, 5000); // interval of 5 seconds
  }

  stopSimulation() {
    clearInterval(this.simulationIntervalId);
    this.consoleService.log('Simulation stopped.',false);
  }

  getParkingPlanes() {
    this.simulatorApiService.getAllPlanes().subscribe(
      (response) => {
        this.consoleService.log(JSON.stringify(response),true);
      },
      (error) => {
        this.consoleService.log('simulation error: ' + JSON.stringify(error),false);
      }
    );
  }

  async RandomActionAPI() {
    this.simulatorApiService.RandomAction().subscribe(
      async (response) => {
        this.consoleService.log(JSON.stringify(response),true);
        if (JSON.stringify(response).toString().includes('landed')) {
          await this.uiContainerService.WhenLandingEmit().toPromise(); // Convert toPromise()
          this.uiContainerService.CheckParking();
        } else {
          this.uiContainerService.CheckParking();
        }
      },
      (error) => {
        this.consoleService.log('simulation error: ' + JSON.stringify(error),false);
      }
    );
  }
  
  

   // Delete All Planes
   deleteAllPlanes() {
    this.simulatorApiService.deleteAllPlanes().subscribe(
      (response: any) => {
      },
      (error: any) => {
      }
    );
  }

  

}
