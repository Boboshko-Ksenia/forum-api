let posts = [
    {
        id: 1,
        title: "First Post",
        content: "This is the content of the first post.",
        author: "Ksyusha",
        category: "dancing"
    },
    {
        id: 2,
        title: "Second Post",
        content: "This is the content of the second post.",
        author: "Ksyusha",
        category: "cooking"
    },
    {
        id: 3,
        title: "Third Post",
        content: "This is the content of the third post.",
        author: "Ksyusha",
        category: "programming"
    }
]
export function getAll(category, take) {
    let result = posts
    if (category) {
        result = result.filter((post) => post.category === category)
    }
    if (take) {
        result = result.slice(0, take)
    }
    return result
}
export function getById(id) {
    return posts.find((post) => {return post["id"] == id})
}
export function addPost(post) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            posts = [...posts, post]
            resolve(post)
        }, 1000 )})
}