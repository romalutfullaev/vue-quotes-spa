export default class QuoteService {

    getQuotesSmall() {
        return fetch('data/products-small.json').then(res => res.json()).then(d => d.data);
    }

    getQuotes() {
        return fetch('data/products.json').then(res => res.json()).then(d => d.data);
    }

    getQuotesWithOrdersSmall() {
        return fetch('data/products-orders-small.json').then(res => res.json()).then(d => d.data);
    }

}
