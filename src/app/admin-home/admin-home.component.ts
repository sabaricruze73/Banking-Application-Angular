import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  activeComponent: string | null = null;
  reportData: any = {};
  selectedDate: string | undefined;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const cookie = document.cookie;
    if (!cookie || cookie.trim() === '') {
      this.router.navigate(['/login']);
    }
  }

  showComponent(componentName: string) {
    this.activeComponent = componentName;
  }

  clearComponent() {
    this.activeComponent = null;
  }

  fetchCustomers() {
    this.clearComponent();
    this.http
      .get('http://localhost:8080/BankingZoho/html/User', {
        responseType: 'json',
      })
      .subscribe((data: any) => {
        document.getElementById('filterTransactionInput')!.style.display =
          'none';
        document.getElementById('responseTxt')!.innerHTML = '';

        const table = document.createElement('table');
        table.innerHTML = `<tr>
                <th>User Name</th>
                <th>Name</th>
                <th>Nick Name</th>
                <th>Date of Birth</th>
                <th>Aadhaar Number</th>
                <th>Pan Number</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Nominee Name</th>
                <th>Account Number</th>
                <th>Account Type</th>
                <th>Balance</th>
                <th>Net Banking</th>
            </tr>`;

        Object.keys(data).forEach((key) => {
          const row = document.createElement('tr');
          row.innerHTML = `
                    <td>${key}</td>
                    <td>${data[key].name}</td>
                    <td>${data[key].nickName}</td>
                    <td>${data[key].dob}</td>
                    <td>${data[key].aadhaarNumber}</td>
                    <td>${data[key].panNumber}</td>
                    <td>${data[key].phoneNumber}</td>
                    <td>${data[key].address}</td>
                    <td>${data[key].nomineeName}</td>
                    <td>${data[key].accountNumber}</td>
                    <td>${data[key].accountType}</td>
                    <td>${data[key].balance}</td>
                    <td>${data[key].netBanking}</td>
                `;
          table.appendChild(row);
        });

        const responseTxt = document.getElementById('responseTxt')!;
        responseTxt.appendChild(table);
      });
  }

  fetchAlltransactions() {
    this.clearComponent();
    this.http
      .get('http://localhost:8080/BankingZoho/html/Transaction', {
        responseType: 'json',
      })
      .subscribe((data: any) => {
        document.getElementById('responseTxt')!.innerHTML = '';

        const table = document.createElement('table');
        table.innerHTML = `<tr>
                <th>Transaction ID</th>
                <th>Account Number</th>
                <th>Amount</th>
                <th>Transaction Type</th>
                <th>Transaction Date</th>
            </tr>`;

        Object.keys(data).forEach((key) => {
          const row = document.createElement('tr');
          row.innerHTML = `
                    <td>${key}</td>
                    <td>${data[key].accountNumber}</td>
                    <td>${data[key].amount}</td>
                    <td>${data[key].transactionType}</td>
                    <td>${data[key].transactionDate}</td>
                `;
          table.appendChild(row);
        });

        const responseTxt = document.getElementById('responseTxt')!;
        responseTxt.appendChild(table);
        document.getElementById('filterTransactionInput')!.style.display =
          'block';
      });
  }

  filterTransaction() {
    this.clearComponent();
    const filterValue = (
      document.getElementById('transactionFilter') as HTMLInputElement
    ).value;

    this.http
      .get('http://localhost:8080/BankingZoho/html/Transaction', {
        params: { amount: filterValue },
        responseType: 'json',
      })
      .subscribe((data: any) => {
        document.getElementById('responseTxt')!.innerHTML = '';

        const table = document.createElement('table');
        table.innerHTML = `<tr>
                <th>Transaction ID</th>
                <th>Account Number</th>
                <th>Amount</th>
                <th>Transaction Type</th>
                <th>Transaction Date</th>
            </tr>`;

        Object.keys(data).forEach((key) => {
          const row = document.createElement('tr');
          row.innerHTML = `
                    <td>${key}</td>
                    <td>${data[key].accountNumber}</td>
                    <td>${data[key].amount}</td>
                    <td>${data[key].transactionType}</td>
                    <td>${data[key].transactionDate}</td>
                `;
          table.appendChild(row);
        });

        const responseTxt = document.getElementById('responseTxt')!;
        responseTxt.appendChild(table);
        document.getElementById('filterTransactionInput')!.style.display =
          'block';
      });
  }

  fetchAllPasswordResetRequests() {
    this.clearComponent();
    this.http
      .get<string[]>(
        'http://localhost:8080/BankingZoho/html/User?mode=listPasswordResetRequests'
      )
      .subscribe((response) => {
        if (!response || response.length === 0) {
          document.getElementById('responseTxt')!.innerHTML =
            "<h3 style='color:red;'>No users found with password change request</h3>";
          return;
        }

        document.getElementById('filterTransactionInput')!.style.display =
          'none';
        document.getElementById('responseTxt')!.innerHTML = '';
        const tableContainer = document.getElementById('responseTxt');

        const table = document.createElement('table');
        const headerRow = table.insertRow();
        const usernameHeader = headerRow.insertCell(0);
        usernameHeader.textContent = 'Username';
        const resetHeader = headerRow.insertCell(1);
        resetHeader.textContent = 'Action';

        response.forEach((username) => {
          const row = table.insertRow();
          const usernameCell = row.insertCell(0);
          usernameCell.textContent = username;

          const buttonCell = row.insertCell(1);
          const resetButton = document.createElement('button');
          resetButton.textContent = 'Reset';
          resetButton.onclick = () => this.resetPassword(username);
          buttonCell.appendChild(resetButton);
        });

        tableContainer!.appendChild(table);
      });
  }

  resetPassword(username: string) {
    const data = new HttpParams().set('userName', username);
    this.http
      .post(
        'http://localhost:8080/BankingZoho/html/User?mode=resetPassword',
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .subscribe((response: any) => {
        this.clearComponent();
        document.getElementById('responseTxt')!.innerHTML = response;
      });
  }

  fetchPlayGameRequests() {
    this.clearComponent();
    this.http
      .get<string[]>(
        'http://localhost:8080/BankingZoho/html/User?mode=listPlayGameRequests'
      )
      .subscribe((response) => {
        if (!response || response.length === 0) {
          document.getElementById('responseTxt')!.innerHTML =
            "<h3 style='color:red;'>No users found with game request</h3>";
          return;
        }

        const uniqueUsers = [...new Set(response)];
        document.getElementById('filterTransactionInput')!.style.display =
          'none';
        document.getElementById('responseTxt')!.innerHTML = '';
        const tableContainer = document.getElementById('responseTxt');

        const table = document.createElement('table');
        const headerRow = table.insertRow();
        const usernameHeader = headerRow.insertCell(0);
        usernameHeader.textContent = 'Username';
        const actionHeader = headerRow.insertCell(1);
        actionHeader.textContent = 'Action';

        uniqueUsers.forEach((username) => {
          const row = table.insertRow();
          const usernameCell = row.insertCell(0);
          usernameCell.textContent = username;

          const buttonCell = row.insertCell(1);
          const acceptButton = document.createElement('button');
          acceptButton.textContent = 'Accept';
          acceptButton.onclick = () => this.acceptGame(username);
          buttonCell.appendChild(acceptButton);
        });

        tableContainer!.appendChild(table);
      });
  }

  acceptGame(username: string) {
    const data = new HttpParams().set('userName', username);
    this.http
      .post(
        'http://localhost:8080/BankingZoho/html/User?mode=acceptGame',
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .subscribe((response: any) => {
        document.getElementById('responseTxt')!.innerHTML = response;
      });
  }

  fetchTransactionReportDiv() {
    this.clearComponent();
    document.getElementById('filterTransactionInput')!.style.display = 'none';
    document.getElementById('responseTxt')!.innerHTML = '';
    document.getElementById('transactionReportDiv')!.style.display = 'block';
  }

  fetchReport() {
    let days;
    if (this.selectedDate != null) {
      days = this.formatDate(this.selectedDate);
      console.log(days);
      if (parseInt(days) < 1) {
        alert('Enter valid number of days');
        return;
      }
    }

    document.getElementById('transactionReportDiv')!.style.display = 'none';
    document.getElementById('filterTransactionInput')!.style.display = 'none';
    const apiUrl = `http://localhost:8080/BankingZoho/html/Transaction?mode=report&days=${days}`;

    this.http
      .get<{
        [key: string]: {
          accountNumber: string;
          amount: string;
          transactionType: string;
          transactionDate: string;
        };
      }>(apiUrl)
      .subscribe((data) => {
        if (!data || Object.keys(data).length === 0) {
          document.getElementById('responseTxt')!.innerHTML =
            "<h3 style='color:red;'>No transactions found</h3>";
          return;
        }

        this.reportData = data;

        const table = document.createElement('table');
        table.innerHTML = `<tr>
                <th>Transaction ID</th>
                <th>Account Number</th>
                <th>Amount</th>
                <th>Transaction Type</th>
                <th>Transaction Date</th>
            </tr>`;

        Object.keys(data).forEach((key) => {
          const transaction = data[key];
          const row = document.createElement('tr');
          row.innerHTML = `
                    <td>${key}</td>
                    <td>${transaction.accountNumber}</td>
                    <td>${transaction.amount}</td>
                    <td>${transaction.transactionType}</td>
                    <td>${transaction.transactionDate}</td>
                `;
          table.appendChild(row);
        });

        const reportTable = document.getElementById(
          'responseTxt'
        ) as HTMLElement;
        reportTable!.innerHTML = '';
        reportTable.appendChild(table);

        const button = document.createElement('button');
        button.classList.add('download-btn');
        button.textContent = 'Download Report';
        button.addEventListener('click', () => this.downloadReport());
        reportTable.appendChild(button);
      });
  }

  formatDate(date: string): string {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  }

  downloadReport() {
    const apiUrl =
      'http://localhost:8080/BankingZoho/html/Transaction?mode=downloadReport';

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.reportData),
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'TransactionReport.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error('Error downloading the file:', error));
  }

  showFriendsGroup() {
    this.clearComponent();
    this.http
      .get('http://localhost:8080/BankingZoho/html/Friend?mode=friendsGroup', {
        responseType: 'text',
      })
      .subscribe((response) => {
        document.getElementById('filterTransactionInput')!.style.display =
          'none';
        document.getElementById('responseTxt')!.innerHTML = response;
      });
  }

  navigateTo(url: string) {
    window.location.href = url;
  }

  logout(): void {
    document.cookie =
      'userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    this.router.navigate(['/login']);
  }
}
