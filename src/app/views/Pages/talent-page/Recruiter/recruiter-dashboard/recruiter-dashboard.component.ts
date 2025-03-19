import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-recruiter-dashboard',
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.css']
})
export class RecruiterDashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  // Bar Chart for Job Posts Statistics
  public jobPostChartData: ChartData<'bar'> = {
    labels: ['Art Concepts', '3D Environment', '3D Animations', 'Game Development', 'AR/VR'],
    datasets: [
      {
        data: [3, 5, 2, 4, 1],
        label: 'Job Posts',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], // each bar a different color
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderWidth: 1
      }
    ]
  };

  public jobPostChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false
  };
  public jobPostChartLegend = true;
  public jobPostChartType = 'bar' as const;

  // Pie Chart for Job Applicants Statistics
  public jobApplicantChartData: ChartData<'pie'> = {
    labels: ['Art Concepts', '3D Environment', '3D Animations', 'Game Development', 'AR/VR'],
    datasets: [
      {
        data: [4, 6, 10, 5, 7],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderWidth: 1
      }
    ]
  };

  public jobApplicantChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false
  };
  public jobApplicantChartType = 'pie' as const;


  constructor() { }

  ngOnInit(): void {
    // Optionally fetch data from an API here.
  }
}
