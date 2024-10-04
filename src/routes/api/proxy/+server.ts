export async function GET({ url }: { url: URL }): Promise<Response> {
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
        return new Response('No URL provided', { status: 400 });
    }

    try {
        const response = await fetch(targetUrl);

        if (!response.ok) {
            return new Response('Error fetching data', { status: response.status });
        }

        // Create a ReadableStream from the response body
        const reader = response.body?.getReader();
        const stream = new ReadableStream<Uint8Array>({
            async pull(controller) {
                try {
                    const { done, value } = await reader!.read();
                    if (done) {
                        controller.close();
                        return;
                    }
                    controller.enqueue(value);
                } catch (error) {
                    controller.error(error);
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
                'Access-Control-Allow-Origin': '*', // Allow CORS if needed
            },
            status: 200
        });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    } catch (error: never) {
        return new Response(`Error fetching data: ${error.message}`, { status: 500 });
    }
}
