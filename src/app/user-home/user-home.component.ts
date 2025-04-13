import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
})
export class UserHomeComponent implements OnInit {
  activeComponent: string | null = null;
  onlineTransactionStatus: string = '';
  userDetails: any;
  accountTypeButton: boolean = false;
  transactionStatus: string = '';
  addFriendShow = false;
  addFriendButtonShow = false;
  responseMessage: string = '';
  chatInput: string = '';
  NickNameInput: string = '';
  divHtml: string = '';
  NickName: string = '';
  Name: string = '';
  DateOfBirth: string = '';
  Aadhaar: string = '';
  PanNumber: string = '';
  PhoneNumber: string = '';
  Address: string = '';
  NomineeName: string = '';
  AccountNumber: string = '';
  AccountType: string = '';
  Balance: string = '';
  NetBanking: string = '';
  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const cookie = document.cookie;
    if (!cookie || cookie.trim() === '') {
      this.router.navigate(['/login']);
    }
    this.fetchAccountDetails();
    this.fetchOnlineTransactions();
  }

  showComponent(componentName: string) {
    this.activeComponent = componentName;
  }

  clearComponent() {
    this.activeComponent = null;
  }

  async fetchAccountDetails() {
    try {
      const response = await this.http
        .get('http://localhost:8080/BankingZoho/html/User?mode=selfAccount', {
          responseType: 'text',
        })
        .toPromise();
      const accountType = response;
      console.log(accountType);
      this.accountTypeButton = accountType === 'Current';
    } catch (error) {
      console.error('Error fetching account details', error);
    }
  }

  fetchOnlineTransactions() {
    this.http
      .get<string>(
        'http://localhost:8080/BankingZoho/html/User?mode=onlineTransaction',
        {
          responseType: 'text' as 'json',
        }
      )
      .subscribe({
        next: (response) => {
          this.onlineTransactionStatus = response.trim().toLowerCase();
          this.transactionStatus =
            this.onlineTransactionStatus === 'enabled' ? 'Disable' : 'Enable';
        },
        error: (error) => {
          console.error('Error fetching online transactions:', error);
        },
      });
  }

  async changeOnlineTransactionStatus() {
    try {
      const data = new HttpParams().set('status', this.transactionStatus);
      await this.http
        .post<string>(
          'http://localhost:8080/BankingZoho/html/User?mode=changeTransactionStatus',
          data,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            responseType: 'text' as 'json',
          }
        )
        .toPromise();

      console.log('Status successfully updated');
      this.onlineTransactionStatus =
        this.transactionStatus === 'Disable' ? 'disabled' : 'enabled';
      this.transactionStatus =
        this.transactionStatus === 'Disable' ? 'Enable' : 'Disable';
    } catch (error) {
      console.error('Error changing transaction status:', error);
    }
  }

  fetchTransactions() {
    const userDetailsDiv = document.getElementById('userDetailsDiv');
    userDetailsDiv!.style.display = 'none';

    const mutualFriendsButton = document.getElementById(
      'mutualFriendsButton'
    ) as HTMLElement;
    const chatButton = document.getElementById('chatButton') as HTMLElement;
    mutualFriendsButton.style.display = 'none';
    chatButton.style.display = 'none';
    document.getElementById('chatContainer')!.style.display = 'none';

    this.clearComponent();

    this.http
      .get('http://localhost:8080/BankingZoho/html/Transaction?mode=self', {
        responseType: 'json',
      })
      .subscribe(
        (transactions: any) => {
          const responseDiv = document.getElementById('responseDiv');
          if (!responseDiv) {
            console.error('Required DOM elements are missing.');
            return;
          }

          responseDiv.innerHTML = '';
          responseDiv.style.display = 'block';

          const table = document.createElement('table');
          table.innerHTML = `<tr>
                <th>Transaction ID</th>
                <th>Account Number</th>
                <th>Amount</th>
                <th>Transaction Type</th>
                <th>Transaction Date</th>
            </tr>`;

          transactions.forEach((txn: any) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${txn.transactionId}</td>
                <td>${txn.accountNumber}</td>
                <td>${txn.amount}</td>
                <td>${txn.transactionType}</td>
                <td>${txn.transactionDate}</td>
            `;
            table.appendChild(row);
          });

          responseDiv.appendChild(table);
        },
        (error) => {
          console.error('Error fetching transactions', error);
        }
      );
  }

  async requestForGame() {
    this.clearComponent();
    try {
      const response = await this.http
        .get(
          'http://localhost:8080/BankingZoho/html/User?mode=requestForGame',
          { observe: 'response' }
        )
        .toPromise();

      if (response) {
        if (
          response.status >= 300 &&
          response.status < 400 &&
          response.headers.has('Location')
        ) {
          const redirectUrl = response.headers.get('Location');
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        } else {
          const messageContainer = document.getElementById('responseTxt');
          if (messageContainer && response.body) {
            messageContainer.innerHTML = response.body.toString();
          }
          console.log(response);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  fetchAddFriendDiv(): void {
    const messageContainer = document.getElementById('responseDiv');
    messageContainer!.innerHTML = '';
    this.clearComponent();
    this.addFriendShow = true;
    this.addFriendButtonShow = true;
  }

  addFriend(): void {
    const messageContainer = document.getElementById('responseDiv');
    messageContainer!.innerHTML = '';
    this.clearComponent();
    const addFriendName = (
      document.getElementById('addFriendName') as HTMLInputElement
    ).value;

    const data = new HttpParams().set('userName', addFriendName);
    this.http
      .post<string>(
        'http://localhost:8080/BankingZoho/html/FriendRequest',
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .subscribe(
        (response) => {
          this.responseMessage = response;
        },
        (error) => {
          console.error('Error during POST request:', error);
          this.responseMessage = 'An error occurred while sending request.';
        }
      );
  }

  fetchFriends(): void {
    this.clearComponent();
    const friendsDropDown = document.getElementById('responseDiv');
    if (!friendsDropDown) return;
    friendsDropDown.innerHTML = '';

    this.http
      .get<string[]>('http://localhost:8080/BankingZoho/html/Friend', {
        responseType: 'json',
      })
      .subscribe(
        (friends: string[]) => {
          const selectElement = document.createElement('select');
          selectElement.id = 'friendList';

          if (!friends || friends.length === 0) {
            const optionElement = document.createElement('option');
            optionElement.textContent = 'No friends available';
            selectElement.appendChild(optionElement);
          } else {
            const optionElement = document.createElement('option');
            optionElement.textContent = 'Your friends';
            optionElement.disabled = true;
            selectElement.appendChild(optionElement);

            friends.forEach((friend) => {
              const optionElement = document.createElement('option');
              optionElement.value = friend;
              optionElement.textContent = friend;
              selectElement.appendChild(optionElement);
            });
          }

          friendsDropDown.appendChild(selectElement);

          selectElement.addEventListener('change', () => {
            const mutualFriendsButton = document.getElementById(
              'mutualFriendsButton'
            ) as HTMLElement;
            const chatButton = document.getElementById(
              'chatButton'
            ) as HTMLElement;
            mutualFriendsButton.style.display = 'block';
            chatButton.style.display = 'block';

            mutualFriendsButton.onclick = () => {
              this.showMutualFriends(selectElement.value);
            };
            chatButton.onclick = () => {
              document.getElementById('chatContainer')!.style.display = 'block';
            };
          });
        },
        (error) => {
          console.error('Error fetching friends', error);
        }
      );
  }

  showMutualFriends(username: string): void {
    this.clearComponent();

    const data = new HttpParams().set('userName', username);

    this.http
      .post<string[]>(
        'http://localhost:8080/BankingZoho/html/Friend?mode=mutual',
        data.toString(),
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
          responseType: 'json',
        }
      )
      .subscribe(
        (mutualFriends: string[]) => {
          const tableContainer = document.getElementById('responseDiv');
          if (!tableContainer) {
            console.error('Error: responseDiv element not found');
            return;
          }

          tableContainer.innerHTML = '';

          if (!mutualFriends || mutualFriends.length === 0) {
            tableContainer.innerHTML =
              '<h3 style="color:red;">No mutual friends</h3>';
            return;
          }

          const table = document.createElement('table');
          table.style.width = '100%';
          table.style.borderCollapse = 'collapse';

          const headerRow = document.createElement('tr');
          const headerCell = document.createElement('th');
          headerCell.textContent = 'Mutual Friends';
          headerCell.style.border = '1px solid black';
          headerCell.style.padding = '8px';
          headerRow.appendChild(headerCell);
          table.appendChild(headerRow);

          mutualFriends.forEach((friend) => {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.textContent = friend;
            cell.style.border = '1px solid black';
            cell.style.padding = '8px';
            row.appendChild(cell);
            table.appendChild(row);
          });

          tableContainer.appendChild(table);
          document.getElementById('back-button')!.style.display = 'block';
        },
        (error) => {
          console.error('Error fetching mutual friends:', error);
          const tableContainer = document.getElementById('responseDiv');
          if (tableContainer) {
            tableContainer.innerHTML =
              '<h3 style="color:red;">An error occurred while fetching mutual friends.</h3>';
          }
        }
      );
  }

  submitChat(): void {
    this.clearComponent();
    const messageContainer = document.getElementById('responseDiv');
    messageContainer!.innerHTML = '';
    const chatInput = (document.getElementById('chatInput') as HTMLInputElement)
      .value;
    const dropdown = document.getElementById('friendList') as HTMLSelectElement;
    const recieverUserName = dropdown.value;
    console.log(recieverUserName);
    console.log(chatInput);
    if (chatInput.trim() === '') {
      alert('Please enter a message.');
      return;
    }
    const data = new HttpParams()
      .set('message', chatInput)
      .set('reciever', recieverUserName);
    console.log(data);
    this.http
      .post<string>('http://localhost:8080/BankingZoho/html/Message', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        responseType: 'text' as 'json',
      })
      .subscribe(
        (response) => {
          this.responseMessage = response;
          (document.getElementById('chatInput') as HTMLInputElement).value = '';
          document.getElementById('chatContainer')!.style.display = 'none';
        },
        (error) => {
          console.error('Error during POST request:', error);
          this.responseMessage = 'An error occurred while sending request.';
        }
      );
  }

  showFriendRequest(): void {
    this.clearComponent();
    const tableContainer = document.getElementById('responseDiv');
    tableContainer!.innerHTML = '';

    this.http
      .get<string[]>(
        'http://localhost:8080/BankingZoho/html/FriendRequest?mode=listFriendRequests'
      )
      .subscribe(
        (friendRequests: string[]) => {
          if (!friendRequests || friendRequests.length === 0) {
            alert('No friend requests available');
            return;
          }

          const uniqueUsers = [...new Set(friendRequests)];

          if (!tableContainer) {
            console.error('Table container not found.');
            return;
          }

          tableContainer.innerHTML = '';

          const table = document.createElement('table');
          table.style.border = '1px solid black';
          table.style.borderCollapse = 'collapse';
          table.style.width = '100%';
          table.style.textAlign = 'center';

          const headerRow = table.insertRow();
          const usernameHeader = headerRow.insertCell(0);
          usernameHeader.textContent = 'Username';
          usernameHeader.style.border = '1px solid black';
          usernameHeader.style.padding = '8px';

          const actionHeader = headerRow.insertCell(1);
          actionHeader.textContent = 'Action';
          actionHeader.style.border = '1px solid black';
          actionHeader.style.padding = '8px';

          uniqueUsers.forEach((username) => {
            const row = table.insertRow();
            const usernameCell = row.insertCell(0);
            usernameCell.textContent = username;
            usernameCell.style.border = '1px solid black';
            usernameCell.style.padding = '8px';

            const actionCell = row.insertCell(1);
            const acceptButton = document.createElement('button');
            acceptButton.textContent = 'Accept';
            acceptButton.style.padding = '4px 8px';
            acceptButton.style.cursor = 'pointer';
            acceptButton.onclick = () => this.acceptFriend(username);
            actionCell.appendChild(acceptButton);
          });

          tableContainer.appendChild(table);
        },
        (error) => {
          console.error('Error fetching friend requests:', error);
          const tableContainer = document.getElementById('responseDiv');
          if (tableContainer) {
            tableContainer.innerHTML =
              'An error occurred while fetching friend requests.';
          }
        }
      );
  }

  acceptFriend(username: string): void {
    this.clearComponent();
    const messageContainer = document.getElementById('responseDiv');
    messageContainer!.innerHTML = '';
    const data = new HttpParams().set('userName', username);
    this.http
      .post<string>(
        'http://localhost:8080/BankingZoho/html/FriendRequest?mode=acceptFriend',
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      .subscribe(
        (result) => {
          const responseTxt = document.getElementById('responseTxt');
          if (responseTxt) {
            responseTxt.innerHTML = result;
          }
        },
        (error) => {
          console.error('Error accepting friend request:', error);
          const responseTxt = document.getElementById('responseTxt');
          if (responseTxt) {
            responseTxt.innerHTML =
              'An error occurred while accepting the friend request.';
          }
        }
      );
  }

  viewMessages(): void {
    this.clearComponent();
    const mutualFriendsButton = document.getElementById(
      'mutualFriendsButton'
    ) as HTMLElement;
    const chatButton = document.getElementById('chatButton') as HTMLElement;
    mutualFriendsButton.style.display = 'none';
    chatButton.style.display = 'none';

    this.http
      .get<any>('http://localhost:8080/BankingZoho/html/Message')
      .subscribe((result) => {
        const messageContainer = document.getElementById('responseDiv');
        messageContainer!.style.display = 'block';
        messageContainer!.innerHTML = '';

        const table = document.createElement('table');
        table.style.border = '1px solid black';
        table.style.borderCollapse = 'collapse';
        table.style.textAlign = 'center';
        table.style.width = '100%';

        const headerRow = table.insertRow();
        headerRow.style.border = '1px solid black';

        const headerUserName = headerRow.insertCell(0);
        const headerMessage = headerRow.insertCell(1);
        const headerDate = headerRow.insertCell(2);

        headerUserName.innerHTML = 'User Name';
        headerMessage.innerHTML = 'Message';
        headerDate.innerHTML = 'Date';

        headerUserName.style.border = '1px solid black';
        headerMessage.style.border = '1px solid black';
        headerDate.style.border = '1px solid black';

        for (let messageId in result) {
          const messageDetails = result[messageId];
          const row = table.insertRow();
          row.style.border = '1px solid black';

          const cellUserName = row.insertCell(0);
          const cellMessage = row.insertCell(1);
          const cellDate = row.insertCell(2);

          cellUserName.innerHTML = messageDetails.userName;
          cellMessage.innerHTML = messageDetails.message;
          cellDate.innerHTML = messageDetails.date;
        }

        messageContainer!.appendChild(table);
      });
  }

  async viewDetails() {
    this.clearComponent();
    document.getElementById('chatContainer')!.style.display = 'none';
    const mutualFriendsButton = document.getElementById(
      'mutualFriendsButton'
    ) as HTMLElement;
    const chatButton = document.getElementById('chatButton') as HTMLElement;
    mutualFriendsButton.style.display = 'none';
    chatButton.style.display = 'none';
    const messageContainer = document.getElementById('responseDiv');
    messageContainer!.innerHTML = '';
    try {
      const resultDiv = document.getElementById(
        'userDetailsDiv'
      ) as HTMLElement;

      if (!resultDiv) {
        console.error('Required DOM elements are missing.');
        return;
      }

      resultDiv.style.display = 'block';
      console.log(
        'resultDiv display style after showing:',
        resultDiv.style.display
      );

      const response = await this.http
        .get<string[]>('http://localhost:8080/BankingZoho/html/User?mode=self')
        .toPromise();

      console.log(response);
      if (!response || !Array.isArray(response)) {
        console.error('Invalid response format:', response);
        return;
      }

      this.Name = response[0];
      this.NickName = response[1];
      this.DateOfBirth = response[2];
      this.Aadhaar = response[3];
      this.PanNumber = response[4];
      this.PhoneNumber = response[5];
      this.Address = response[6];
      this.NomineeName = response[7];
      this.AccountNumber = response[8];
      this.AccountType = response[9];
      this.Balance = response[10];
      this.NetBanking = response[11];
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  }

  changeNickName() {
    this.clearComponent();
    const div = document.getElementById('nickNameChangeDiv') as HTMLElement;
    div.style.display = 'block';
    const nickNameChangeSubmitDiv = document.getElementById(
      'nickNameChangeSubmitDiv'
    ) as HTMLElement;
    nickNameChangeSubmitDiv.style.display = 'none';
  }

  async submitNickName() {
    this.clearComponent();
    const data = new HttpParams().set('NickNameInput', this.NickNameInput);
    try {
      const div = document.getElementById('nickNameChangeDiv') as HTMLElement;
      div.style.display = 'none';
      const response = await this.http
        .post(
          'http://localhost:8080/BankingZoho/html/User?mode=updateSelf',
          data,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            responseType: 'text' as 'json',
          }
        )
        .toPromise();
      const result = response as string;
      const nickNameChangeSubmitDiv = document.getElementById(
        'nickNameChangeSubmitDiv'
      ) as HTMLElement;
      this.NickName = this.NickNameInput;
      this.cdr.detectChanges();

      nickNameChangeSubmitDiv.style.display = 'block';
      nickNameChangeSubmitDiv.innerHTML = result;
      document.getElementById('back-button')!.style.display = 'block';
    } catch (error) {
      console.error('Error updating nickname:', error);
    }
  }

  navigateTo(url: string) {
    window.location.href = url;
  }

  logout(): void {
    document.cookie =
      'userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    this.router.navigate(['/login']);
  }

  goBackToHome() {
    location.reload();
  }
}
