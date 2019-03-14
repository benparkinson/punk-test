import Repository from './Repository';

const resource = '/beers';
export default {
    get() {
        return Repository.get(`${resource}`);
    },
    getByMalt(malt) {
        return Repository.get(`${resource}/?malt=${malt}`);
    }
};