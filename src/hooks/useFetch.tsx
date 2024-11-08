import { useEffect, useState } from "react";

type Status = "loading" | "success" | "error";

interface SuccessData<T> {
    status: "success";
    data: T;
}

interface ErrorData {
    status: "error";
    error: string;
}

interface LoadingData {
    status: "loading";
}

type Data<TipoData> = { status: Status } & (
    | SuccessData<TipoData>
    | ErrorData
    | LoadingData
);

export default function useFecth<TipoData>({
    promiseFunction,
}: {
    promiseFunction: () => Promise<TipoData>;
}) {
    const [fetchingStatus, setFetchingStatus] = useState<Data<TipoData>>({
    status: "loading",
    });

    useEffect(() => {
    async function getData() {
        try {
            const value = await promiseFunction();

            setFetchingStatus({
            status: "success",
            data: value,
            });
        } catch (error: any) {
            setFetchingStatus({
            status: "error",
            error: error,
            });
        }
        }

        getData();
    }, []);


    return {
        fetchingStatus,
    };
    }