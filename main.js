const http = require("http");

// 임시 데이터베이스 - 데이터를 메모리에 저장
const users = [
    {
        id: 1,
        name: "Rebekah Johnson",
        email: "Glover12345@gmail.com",
        password: "123qwe",
    },
    {
        id: 2,
        name: "Fabian Predovic",
        email: "Connell29@gmail.com",
        password: "password",
    },
];

// 임시 데이터베이스 - 데이터를 메모리에 저장
const posts = [
    {
        id: 1,
        title: "간단한 HTTP API 개발 시작!",
        content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
        userId: 1,
    },
    {
        id: 2,
        title: "HTTP의 특성",
        content: "Request/Response와 Stateless!!",
        userId: 1,
    },
    {
        id: 3,
        title: "HTTP의 특성 2",
        content: "Request/Response와 Stateless!!",
        userId: 2,
    },
    {
        id: 4,
        title: "HTTP의 특성 3",
        content: "Request/Response와 Stateless!!",
        userId: 3,
    },

];

const server = http.createServer();

const httpRequestListener = async (request, response) => {
		// 구조분해 할당
		// Mssion 1 - 회원가입.
		// Mission 2 - 게시물 등록
    const { url, method } = request;

    if (method === "GET") {
        if (url === "/ping") {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ message: "pong" }));
        } else if (url === "/posts") {
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ posts }));
        } else if (url.startsWith("/users")) {
            const userId  = parseInt(url.split("/")[2]);
            const user    = users.find((user) => user.id === userId);
            const results = posts.filter((post) => post.userId === userId);

//						const results = []
//
//						for (i = 0; i < posts.length ;i++) {
//							if (i.userId === userId) {
//								results.push(i)
//							}
//						}
//

            user.posts = results;
            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ data: user }));
        }
    } else if (method === "POST") {
        if (url === "/users/signup") {
            let rawData = "";

            await request.on("data", (chunk) => {rawData += chunk});

            await request.on("end", () => {
                const user = JSON.parse(rawData);

                users.push({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                });
            });

						response.writeHead(201, { "Content-Type": "application/json" });
						response.end(JSON.stringify({ message: "SUCCESS" }));

        } else if (url === "/posts") {
            let rawData = "";

            request.on("data", (chunk) => rawData += chunk);

            request.on("end", () => {
                const post = JSON.parse(rawData);
								/*
									{
											"content": "ss",
											"id": 3,
											"title": "위코드 생활",
											"userId": 1
									}
								 */
                const user = users.find((user) => user.id === post.userId);

                if (user) {
                    posts.push({
                        id: post.id,
                        name: post.title,
                        content: post.content,
                        userId: post.userId,
                    });
                    response.writeHead(201, { "Content-Type": "application/json" });
                    response.end(JSON.stringify({ posts:posts }));
                } else {
                    response.writeHead(404, { "Content-Type": "application/json" });
                    response.end(JSON.stringify({ message: "NOT FOUND" }));
                }
            });
        }
    } else if (method === "PATCH") {
        if (url.startsWith("/posts")) {
            let rawData = "";        
        
            request.on("data", (chunk) => {
                rawData += chunk;
            });

            request.on("end", () => {

                const postId = parseInt(url.split("/")[2]);

                const data = JSON.parse(rawData);

                const post = posts.find((post) => post.id === postId);

                post.title = data.title;
                post.content = data.content;
                
                response.writeHead(200, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ post: post }));
            });
        }
    } else if (method === "DELETE") {
        if (url.startsWith("/posts")) {
            const postId = parseInt(url.split("/")[2]);
            //const postId = +url.split("/")[2];
            
            const indexOfPostId = posts.findIndex((post) => post.id === postId);
            
            posts.splice(indexOfPostId, 1);
            
            response.end();
        }
    }
};

server.on("request", httpRequestListener);

server.listen(3001, "127.0.0.1", function () {
    console.log(`Listening to request on 127.0.0.1:3000`);
});
