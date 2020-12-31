export enum OrderStatus {
    // when the order had been created 
    // but the ticket is trying to order has nnot been reserved
    Created = 'created', 
    Cancelled = 'cancelled', 
    AwaitingPayment = 'awaiting:payment', 
    Complete = 'complete'
}