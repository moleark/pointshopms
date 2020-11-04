export async function FetchPost(url: string, data: any) {
    return await window.fetch(url, {
        method: 'post',
        body: data,
        headers: {
            'Accept': 'application/x-www-form-urlencoded',
            'Content-Type': 'application/json',
        }
    });
}