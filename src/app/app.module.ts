import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DialogService } from './custom-modal/dialog.service';
import { ModalComponent } from './modal/modal.component';
import { TransactionOverviewComponent } from './transaction-overview/transaction-overview.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from './material-components.module';
import { TransactionsTableComponent } from './transactions-table/transactions-table.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [];
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ModalComponent,
    TransactionOverviewComponent,
    MaterialModule,
    TransactionsTableComponent,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [DialogService],
  exports: [RouterModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
