import { documentStatus } from "@root/config/constant";
import to from "await-to-js";
import { useEffect, useState } from "react";
import { getCountByStatus } from "../helpers/utils";
import documentService from "../services/documentService";
import useBaseHooks from "./BaseHook";

const useStatusCount = () => {
	const { t, redirect, notify } = useBaseHooks();
	const [document, setDocuments] = useState(null);
	const [statusCount, setStatusCount] = useState({
		'Approved': 0,
		'To Be Reviewed': 0,
		'Rejected': 0,
		'Draft': 0,
		'Submitted': 0,
		'Pending': 0,
		'Cancelled': 0,
	});

	const fetchData = async (values?: any) => {
		let [error, documents]: [any, any] = await to(
			documentService().withAuth().index(values)
		);

		if (error) {
			const { code, message } = error;
			notify(t(`errors:${code}`), t(message), "error");
			return {};
		}
		const countByStatus = await getCountByStatus(documents?.data);
		Object.keys(countByStatus).map((item) => {
			if (documentStatus.hasOwnProperty(item)) {
				// re-name object keys
				countByStatus[documentStatus[item]] = countByStatus[item];
				// delete previous key
				delete countByStatus[item];
			}
			
			
		});
		setStatusCount({
			...statusCount,
			...countByStatus,
		});
		setDocuments(Number(documents.total) 
		// - Number(countByStatus["Draft"] || 0)
		);
		return documents;
	};

	useEffect(() => {
		fetchData();
	}, []);

	return {
		...statusCount,
		total: document,
	};
};

export default useStatusCount;