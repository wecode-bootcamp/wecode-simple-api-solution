/*
    "A" : "API 개발 너무 어려워요 ㅜㅜ..."
    "M" : "뭐가 제일 어려우세요?"
    "A" : "다른 사람의 코드를 보고 만들 수는 있지만, 빈 파일에서는 어떻게 코드를 쳐야될지 모르겠어요.."
    "M" : "주니어 뿐만 아니라 빈 파일에서 코드를 작성할 수 있는 사람은 아무도 없습니다."
    "M" : "API를 만든다는 것은 이미 개발자들이 만들어 놓은 제품(node.js, http 모듈)들의 사용 설명서를 
            잘 읽어보고 사용법에 맞게 사용하는 것에서부터 시작합니다."
    
    "M" : "간단합니다. 설명서를 읽는다. 설명서에 나와있는 사용법으로 제품을 사용한다."
    "M" : "지금 당장은 어렵겠지만, API를 개발하는 방법은 패턴화가 되어 있습니다. 패턴을 익히는 것이 중요합니다!"
*/

/*
    과제 구현 목표
    - API 서버(server) 역할을 수행하는 javascript 코드 작성 및 실행
    - API 서버에서 아래의 기능들 제공
        1. health-check (클라이언트의 요청을 받을 준비 완료?!)
        2. 회원가입 (웹 사이트에서 회원가입 할 때 입력한 정보는 어디에 저장될까요?)
        3. 게시물 생성 (인스타그램에서 게시물을 등록할 때, 제목과 내용이 어디에 저장될까요?)
        4. 전체 게시물 조회 (인스타그램 홈 화면에 접속했을 때, 게시물 정보들이 어디로부터 오는가?)
        5. 게시물 정보 수정 (마음에 들지 않는 게시물 내용을 수정할 때, 무슨 일이 일어날까요?) -> PATCH
        6. 게시물 정보 삭제 (이불킥 하고 싶어지는 게시물을 삭제할 때, 무슨 일이 일어날까요?) -> DELETE
        7. 회원 정보 조회 (마이페이지에서 내 정보와 내가 작성한 게시물은 어떻게 보이는 걸까요?)
*/

/*
    구현 순서
    - STEP 1. 임시 데이터베이스와 API 서버 객체 생성 및 세팅!
    - STEP 2. health-check 기능 추가 ("개발자 언어로는 엔드포인트를 추가한다."라고 얘기합니다.)
    - STEP 3. 회원가입 기능 추가
    - STEP 4. 등록한 회원이 게시물 생성하는 기능 추가
    - STEP 5. 전체 게시물 조회 기능 추가
    - STEP 6. 게시물 정보 수정 기능 추가
    - STEP 7. 게시물 정보 삭제 기능 추가
    - STEP 8. 회원 정보 조회 기능 추가
*/

// STEP 1. 임시 데이터베이스와 API 서버 객체 생성 및 세팅!
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
];

/*
    STEP 2. health-check
    목적    : 클라이언트의 요청을 서버가 받을 수 있는 상태인지 검점하기 위한 기능 (엔드포인트)
    Input  : 서버의 생사를 확인하기 위해서 Client에게 받아야되는 정보는 무엇인가?
        - 요청 자체만 받아도 될 것 같다.
        - http request
            1. Start-line : HTTP Method(GET, POST, DELETE, PATCH) + HTTP version + Target (/posts)
            2. Header : localhost, content-type (json)
            3. Body : 데이터
        - http response
            1. Status-line : Status Code (200 or 201 or 404 or 500 or 403) + status message ("OK") 
            2. Header : localhost, content-type (json)
            3. Body : 데이터
        - 예제)
            http request -> GET http://localhost:3001/ping
                1. Start-line : GET + Target (/ping)
                2. Header : host (localhost:3001) - 자동으로 할당 됨
                3. Body : 데이터
    Output : 서버가 잘 실행되고 있다는 메시지를 반환하자. 
            http response
                1. Status-line : 200 OK
                2. Header : host (localhost:3001) - 자동으로 할당 됨
                3. Body : {"message" : "pong"}
*/

const http = require('http')

const server = http.createServer()

server.on('request', function (req, res) {
    console.log('브라우저에서 HTTP Request 요청이 들어왔다!')

    const target = req.url
    const httpMethod = req.method
    
    console.log(target)

    if (target === '/ping') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify({"message" : "pong"}))
        res.end()
    }

    if (httpMethod === 'GET') {
        
        console.log(target) // users/1
        // 회원 정보 조회
        // GET http://localhost:3001/users/1
        if (target.startsWith('/users')) {
            // Client에서 전달한 사용자 고유 ID를 URL에서 꺼내옴
            const userId = parseInt(target.split("/")[2]);

            console.log(userId)
            
            // 우리 데이터베이스에 존재하는 사용자인지 확인 후 불러옴
            const user = users.find((user) => user.id === userId);

            console.log(user)

            // line 97에서 선언한 user가 작성한 게시물을 가져와됨.
            const results = posts.filter((post) => post.userId === userId);

            console.log(posts)

            user.posts = results;

            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ data: user }));

        }
        
        //전체 게시글 목록
        // GET http://localhost:3001/posts
        if (target === '/posts') {
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ data: posts }));
        }
    }

    if (httpMethod === 'POST') {
        // 회원가입
        // POST localhost:3001/users/signup
        if (target === '/users/signup') {
            let rawData = "";

            console.log("rawData", rawData)

            req.on("data", (chunk) => {rawData += chunk});
            req.on("end", () => {
                const user = JSON.parse(rawData);

                users.push({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                });

                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "SUCCESS" }));
            })
        }

        // 게시물 생성
        // POST http://localhost:3001/posts
        if (target === '/posts') {
            let rawData = "";

            req.on("data", (chunk) => {
                console.log("데이터 이벤트에 연결된 함수 내부", rawData)
                rawData += chunk;
            });

            req.on("end", () => {
                const post = JSON.parse(rawData);
                const user = users.find((user) => user.id === post.userId);

                if (user) {
                    posts.push({
                        id: post.id,
                        name: post.title,
                        content: post.content,
                        userId: post.userId,
                    });
                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "SUCCESS" }));
                } else {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ message: "USER DOSE NOT EXISTS!!!" }));
                }
            });
        }        
    }

    if (httpMethod === 'PATCH') {
        // 게시물 수정
        // PATCH http://localhost:3001/posts
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
    }

    if (httpMethod === 'DELETE') {
        // 게시물 삭제
        // DELETE http://localhost:3001/posts
        if (url.startsWith("/posts")) {
            const postId = parseInt(url.split("/")[2]);
            
            const indexOfPostId = posts.findIndex((post) => post.id === postId);
            
            posts.splice(indexOfPostId, 1);
            
            response.end();
        }
    }
})

server.listen(3001, function(){
    console.log('3001번 포트로 서버가 실행되었습니다.')
})
