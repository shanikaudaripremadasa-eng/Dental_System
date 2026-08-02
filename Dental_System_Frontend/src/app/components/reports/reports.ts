import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AppointmentService } from '../../services/appointment';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent implements OnInit {
  public chart: any;
  public totalAppointments: number = 0;
  public busiestMonth: string = '';

  
  constructor(private appointmentService: AppointmentService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.appointmentService.getAppointments().subscribe((data: any) => {
      this.createChart(data);
    });
  }

  createChart(appointments: any[]) {
    if (this.chart) this.chart.destroy();

  
    this.totalAppointments = appointments.length;
    
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dataCounts = months.map(m =>
      appointments.filter(a => {
        const date = new Date(a.appointmentDate);
        return date.getMonth() === m && date.getFullYear() === 2026;
      }).length
    );

    const maxVal = Math.max(...dataCounts);
    this.busiestMonth = maxVal > 0 ? monthNames[dataCounts.indexOf(maxVal)] : "N/A";

   
    this.cdr.detectChanges(); 

    this.chart = new Chart("MyChart", {
      type: 'bar',
      data: {
        labels: monthNames,
        datasets: [{
          label: "Monthly Appointments",
          data: dataCounts,
          backgroundColor: '#007bff',
          borderRadius: 5,
          barThickness: 30
        }]
      },
      plugins: [ChartDataLabels],
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#000',
            font: { weight: 'bold' }
          }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }
  
  downloadPDF() {
    const canvas = document.getElementById('MyChart') as HTMLCanvasElement;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'Clinic_Performance_Report.png';
    link.click();
  }
}