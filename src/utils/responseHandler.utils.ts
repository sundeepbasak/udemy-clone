import { NextResponse } from "next/server"



// export const successResponse = (message: string, statusCode = 200) => {
//     return NextResponse.json({ message }, { status: statusCode })
// }

// export const errorResponse = (message = 'Internal Server Error', statusCode = 500) => {
//     return NextResponse.json({ error: message }, { status: statusCode })
// }


export class HttpResponse {

    private code: number = 500;
    private message: string = "Internal Server Error"

    notFound(message: string) {
        this.code = 404;
        this.message = message

        return NextResponse.json({ message: this.message }, { status: this.code })
    }

    unauthorize() {
        this.code = 401;
        return NextResponse.json({ message: 'Unauthorized', status: this.code })
    }

    internalServerError(message: string = 'Internal Server Error') {
        this.code = 500;
        this.message = message

        return NextResponse.json({ message: this.message }, { status: this.code })
    }

    success(data: any, message: string = 'Request successfull') {
        this.code = 200;
        this.message = message

        return NextResponse.json({ message: this.message, data }, { status: this.code })
    }

    created(message: string = 'Creation successfull') {
        this.code = 201;
        this.message = message

        return NextResponse.json({ message: this.message }, { status: this.code })
    }

}