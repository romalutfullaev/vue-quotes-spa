export default class AuthorsService {
    getAuthors() {
        return fetch('http://localhost:3000/authors')
            .then((res) => res.json())
            .then((d) => d.data);
    }

}
