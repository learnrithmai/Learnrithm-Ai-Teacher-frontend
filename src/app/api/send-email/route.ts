import { ContactUsSchema } from "@/types/otherFormsSchema";
import { sendContactEmail } from "@/utils/emailUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { type, dataToSend } = (await req.json()) as {
            type: "CONTACT" | "SUBSCRIPTION",
            dataToSend: ContactUsSchema,
        };
        if (!type || !dataToSend) {
            return NextResponse.json(
                { error: "Missing type or data" },
                { status: 400 }
            );
        }

        if (type === "CONTACT") {
            await sendContactEmail(dataToSend);
            return NextResponse.json({
                message: "Contact email sent successfully",
            });
        } else if (type === "SUBSCRIPTION") {
            // await sendSubscriptionEmail(dataToSend);
            // return NextResponse.json({
            //     message: "Subscription email sent successfully",
            // });
        } else {
            return NextResponse.json(
                { error: "Invalid email type" },
                { status: 400 }
            );
        }
    } catch (error: unknown) {
        return NextResponse.json(
            { error: error as string || "Something went wrong" },
            { status: 500 }
        );
    }
}