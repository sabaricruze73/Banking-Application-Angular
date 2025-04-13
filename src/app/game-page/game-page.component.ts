import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './game-page.component.html',
})
export class GamePageComponent implements OnInit {
  isCurrentPlayer = false;
  userType = '';
  responseTxt = '';
  hint = '';
  playersParaDisplay = 'none';
  gameStatusDisplay = 'none';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getTotalPlayers();
    this.getPlayerStatus();
    setInterval(() => {
      this.getTotalPlayers();
      this.getPlayerStatus();
    }, 3000);
  }

  getPlayerStatus(): void {
    this.http
      .get(
        'http://localhost:8080/BankingZoho/html/TicTacToe?mode=playerStatus'
      )
      .subscribe((response: any) => {
        const moveType = response.moveType;
        this.isCurrentPlayer = response.isCurrentPlayer;
        this.userType = `You are player ${moveType}`;
      });
  }

  getTotalPlayers(): void {
    this.http
      .get(
        'http://localhost:8080/BankingZoho/html/TicTacToe?mode=totalPlayers'
      )
      .subscribe((response: any) => {
        const totalPlayers = response;
        if (totalPlayers === 'One') {
          this.playersParaDisplay = 'block';
        } else if (totalPlayers === 'Zero') {
          this.getGameStatus();
        } else {
          this.displayBoard();
        }
      });
  }

  getGameStatus(): void {
    this.http
      .get(
        'http://localhost:8080/BankingZoho/html/TicTacToe?mode=gameStatus'
      )
      .subscribe((response: any) => {
        const gameStatus = response.gameStatus;
        if (gameStatus) {
          const gameEndStatus = response.gameEndStatus;
          this.gameStatusDisplay = 'block';
          this.responseTxt = `${gameEndStatus} <a href="userHomePage.html">Click here to go to the home page</a>`;
        }
      });
  }

  displayBoard(): void {
    this.http
      .get(
        'http://localhost:8080/BankingZoho/html/TicTacToe?mode=printBoard'
      )
      .subscribe((response: any) => {
        const tableValues = response;
        const board = document.getElementById('board')!;
        board.innerHTML = '';
        const table = this.createTable(3, 3, tableValues);
        board.appendChild(table);
      });
  }

  createTable(
    row: number,
    column: number,
    tableValues: string[]
  ): HTMLTableElement {
    const table = document.createElement('table');
    table.style.border = '1px solid black';
    table.style.borderCollapse = 'collapse';
    table.style.width = '150px';
    table.style.height = '150px';
    table.style.textAlign = 'center';
    let index = 0;

    for (let i = 0; i < row; i++) {
      const tableRow = document.createElement('tr');
      for (let j = 0; j < column; j++) {
        const cell = document.createElement('td');
        cell.textContent = tableValues[index];
        cell.style.border = '1px solid black';
        cell.style.padding = '8px';
        cell.style.textAlign = 'center';
        cell.style.width = '50px';
        cell.style.height = '50px';
        cell.dataset['row'] = i.toString();
        cell.dataset['column'] = j.toString();

        cell.addEventListener('click', () => {
          if (cell.textContent === ' ' && this.isCurrentPlayer) {
            const row = cell.dataset['row'] as string;
            const column = cell.dataset['column'] as string;
            const params = new URLSearchParams({ row, column }).toString();

            this.http
              .post(
                'http://localhost:8080/BankingZoho/html/TicTacToe?mode=move',
                params,
                {
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                  },
                }
              )
              .subscribe({
                next: (response: any) => {
                  this.responseTxt = response;
                  this.displayBoard();
                },
                error: () => {
                  alert(
                    'An error occurred while making your move. Please try again.'
                  );
                },
              });
          } else if (!this.isCurrentPlayer) {
            this.responseTxt = 'Please wait for your move.';
          }
        });

        tableRow.appendChild(cell);
        index++;
      }
      table.appendChild(tableRow);
    }

    return table;
  }

  fetchHint(): void {
    this.http
      .get('http://localhost:8080/BankingZoho/html/TicTacToe?mode=hint')
      .subscribe((response: any) => {
        const chanceForWin = response.chanceForWin;
        if (!chanceForWin) {
          this.hint =
            'Currently, there is no possibility for the opponent to win';
        } else {
          const row = response.row;
          const column = response.column;
          this.hint = `Place your move in the cell of index ${row},${column} to prevent your opponent from winning`;
        }
      });
  }
}
