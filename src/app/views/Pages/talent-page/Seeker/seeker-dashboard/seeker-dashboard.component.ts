import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-seeker-dashboard',
  templateUrl: './seeker-dashboard.component.html',
  styleUrls: ['./seeker-dashboard.component.css']
})
export class SeekerDashboardComponent implements OnInit{
  constructor(private router: Router ) {}
  ngOnInit(): void {
    // Optionally fetch data from an API here.
  }

 @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  // Bar Chart for Job Posts Statistics
  public projectChartData: ChartData<'bar'> = {
    labels: ['Art Concepts', '3D Environment', '3D Animations', 'Game Development', 'AR/VR'],
    datasets: [
      {
        data: [3, 5, 2, 4, 1],
        label: 'Project Uploads',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], // each bar a different color
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderWidth: 1
      }
    ]
  };

  public projectChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false
  };
  public projectChartLegend = true;
  public projectChartType = 'bar' as const;

  // Pie Chart for Job Applicants Statistics
  public projectCategoryChartData: ChartData<'pie'> = {
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

  public projectCategoryChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false
  };
  public projectCategoryChartType = 'pie' as const;


}
