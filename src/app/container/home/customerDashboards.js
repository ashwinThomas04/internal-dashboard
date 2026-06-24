import { useState } from "react";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { Text } from "../../components/typography";
import CONFIG from "../../config";
import { useCache } from "../../context";
import { useApi } from "../../service/hooks";
import { Card } from "../../components/surface";
import { Badge } from "../../components/badge";
import { SelectInput } from "../../components/input";
import { PrimaryButton } from "../../components/cta";
import { useAlerts } from "../../components/alerts";
import { utils } from "../../utils";


const BASE_PATH = "qbriux.io/auth/signup";
const AVAILABLE_DASHBOARDS = [
    { label: "Asian 5", merchantId: "1561", amx: "BQWC", base: "asian5" },
    { label: "Eathos", merchantId: "1529", amx: "BQTK", base: "eathos" },
    { label: "Tortilla", merchantId: "1568", amx: "BRUC", base: "tortilla" },
    { label: "Chuck E Cheese", merchantId: "1545", amx: "BMWC", base: "membresias", basePath: "cecmexico.com/auth/signup" },
];

const STORE_SELECTION_TYPES = [
    { label: "All Stores", value: "all" },
    { label: "Selected Stores", value: "select" }
]

const CustomerDashboard = () => {
    const api = useApi();
    const cache = useCache();
    const [storeSelectionType, setStoreSelectionType] = useState({ label: "All Stores", value: "all" });
    const [selectedStores, setSelectedStores] = useState([]);
    const [stores, setStores] = useState([]);
    const [selectedMerchant, setSelectedMerchant] = useState({ label: "Asian 5", merchantId: "1561", amx: "BQWC", base: "asian5" });
    const [storesLoading, setStoresLoading] = useState(false);
    const [qrLoading, setQrLoading] = useState(false);
    const [qrCodes, setQrCodes] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const alerts = useAlerts();

    const fetchStores = async (amx) => {
        const s = cache.getItem(`stores_${selectedMerchant.merchantId}`);
        if (s) return s.data;
        else {
            setStoresLoading(true);
            const url = `${CONFIG.apiBase}/store/${amx}/customer/web/signUp/listStores`;
            const res = await api.get(url);
            if (res.ok) {
                setStoresLoading(false);
                cache.setItem(`stores_${selectedMerchant.merchantId}`, { data: res.body });
                return res.body;
            }
            else {
                setStoresLoading(false);
                return null
            }
        }
    }

    const handleStoreSelectionChange = async (val) => {
        setStoreSelectionType(val);
        if (val.value === "select") {
            const data = await fetchStores(selectedMerchant.amx);
            if (data) setStores(data);
            else alerts.triggerToast("Error getting stores.", "There was an error in getting the stores list.", "ERROR");
        }
    }

    const handleSwitchMerchant = (item) => {
        setSelectedMerchant(item);
        setStoreSelectionType({ label: "All Stores", value: "all" });
        setSelectedStores([]);
        setStores([]);
        setQrCodes(null);
    }

    const toggleStores = (storeId) => {
        setSelectedStores(prev => {
            if (prev.includes(storeId)) return prev.filter(id => id !== storeId);
            return [...prev, storeId];
        })
    }

    const generateCodes = async () => {
        setQrLoading(true);
        let b = [];
        if (storeSelectionType.value === "all") {
            const s = await fetchStores(selectedMerchant.amx);
            if (s?.length) {
                s.forEach(store => {
                    const amx = utils.generateCipher(`${store.storeId}`);
                    const url = `https://${selectedMerchant.base}.${selectedMerchant.basePath ? selectedMerchant.basePath : BASE_PATH}?amx=${amx}`;
                    b.push({ name: store.storeName, id: store.storeId, url });
                });
            }
            else {
                setQrLoading(false);
                alerts.triggerToast("Error getting stores.", "There was an error in getting the stores list.", "ERROR");
            }
        }
        else {
            if (selectedStores.length) {
                selectedStores.forEach(storeId => {
                    const store = stores.find(item => item.storeId === storeId);
                    const amx = utils.generateCipher(`${storeId}`);
                    const url = `https://${selectedMerchant.base}.${selectedMerchant.basePath ? selectedMerchant.basePath : BASE_PATH}?amx=${amx}`;
                    b.push({ name: store.storeName, id: store.storeId, url });
                });
            }
            else {
                setQrLoading(false);
                alerts.triggerToast("No stores selected.", "Please select at least one store.", "ERROR");
            }
        }

        try {
            await new Promise(r => setTimeout(() => { r(true) }, 100));
            let codes = [];
            for (const item of b) {
                const code = await utils.generateQRCode(item.url);
                codes.push({ ...item, code });
            }
            setQrCodes(codes);
        } catch (error) {
            alerts.triggerToast("Error generating QR codes.", "There was an error in generating the QR codes.", "ERROR");
        }
        finally {
            setQrLoading(false);
        }

    }

    const downloadZip = async (codes) => {
        if (!codes || codes.length === 0) {
            alerts.triggerToast("No codes to download.", "Please select at least one store.", "ERROR");
            return;
        }

        const zip = new JSZip();
        const folder = zip.folder(`${selectedMerchant.label}-codes`);

        codes.forEach((qr) => {
            const base64Data = qr.code.split(',')[1];

            const filename = utils.sanitizeName(qr.name);
            folder.file(`${filename}.png`, base64Data, { base64: true });
        });

        try {
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${selectedMerchant.label}-store-codes.zip`);
        } catch (error) {
            alerts.triggerToast("Error downloading QR codes.", "There was an error in downloading the QR codes.", "ERROR");
        }
    };

    const handleDownload = async () => {
        setDownloading(true);
        try {
            await new Promise(r => setTimeout(() => { r(true) }, 200));
            await downloadZip(qrCodes);
        } catch (error) {
            alerts.triggerToast("Error downloading QR codes.", "There was an error in downloading the QR codes.", "ERROR");
        } finally {
            setDownloading(false);
        }

    }

    const handleCopy = (e, url) => {
        e.stopPropagation();
        const value = url;
        if (!value) return;
        navigator.clipboard.writeText(value).then(() => {
            alerts.triggerToast(
                "Copied to clipboard",
                `${value} copied successfully.`,
                "SUCCESS"
            );
        }).catch(err => {
            console.error("Failed to copy", err);
        });
    };

    return (
        <>
            <Text size="title-sm" weight="black" className="pt-2">Available Merchants</Text>
            <Text className="pb-4">Select a merchant and store to generate the QR code.</Text>
            <div className="qb-offers-listing-grid-container w-100 d-grid gap-3">
                {AVAILABLE_DASHBOARDS.map((item) => (
                    <Card className={`p-4 d-flex flex-column align-items-stretch justify-content-between qb-transition-base ${selectedMerchant?.merchantId === item.merchantId ? "qb-border-solid-primary" : ""}`} key={item.amx} onClick={() => { handleSwitchMerchant(item) }}>
                        {
                            selectedMerchant?.merchantId === item.merchantId ?
                                <div className="d-flex align-items-start justify-content-between gap-3">
                                    <Text size="title-sm" weight="bold">{item.label}</Text>
                                    <Badge size="md" color="primary" weight="black">SELECTED</Badge>
                                </div>
                                :
                                <Text size="title-sm" weight="bold">{item.label}</Text>
                        }
                        <div className="d-flex align-items-center justify-content-center">
                            <img src={`${CONFIG.assetsBase}/dashboard/${item.merchantId}/logo.webp`} alt={item.label} className="qb-merchant-logo-image" />
                        </div>
                        <div className="d-flex align-items-end justify-content-between gap-3">
                            <Text size="tag" weight="bold" color="muted" className="text-uppercase">Merchant ID</Text>
                            <Text size="paragraph-xs">{item.merchantId}</Text>
                        </div>
                    </Card>
                ))}
            </div>
            <div className="pt-4">
                <Card className="p-4 container-fluid">
                    <div className="row gy-4 gx-3">
                        <div className="col-12 col-lg-4">
                            <SelectInput label="Stores" selected={storeSelectionType} options={STORE_SELECTION_TYPES} onSelect={val => handleStoreSelectionChange(val)} />
                        </div>
                        {
                            storeSelectionType?.value === "select" ?
                                <>
                                    {
                                        storesLoading || !stores ?
                                            <div className="py-6 w-100 d-flex align-items-center justify-content-center">
                                                <div className="qb-page-loader"></div>
                                            </div>
                                            :
                                            <div className="col-12">
                                                <div className="d-flex flex-wrap gap-3">
                                                    {stores?.map((item) => {
                                                        return (
                                                            <div className={`qb-transition-base px-4 qb-fs-paragraph-sm d-flex align-items-center justify-content-center gap-3 py-2 qb-br-48 qb-cursor-pointer ${selectedStores.includes(item.storeId) ? "qb-border-solid-primary qb-text-primary qb-bg-light" : "qb-border-solid-dark qb-text-dark"}`} key={item.storeId} onClick={() => { toggleStores(item.storeId) }}>
                                                                {item.storeName}
                                                                {
                                                                    selectedStores.includes(item.storeId) ?
                                                                        <div className="p-1 qb-bg-primary qb-br-48"></div>
                                                                        : null
                                                                }
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                    }
                                </>
                                :
                                null
                        }
                        <div className="col-12">
                            <div className="w-100 d-flex align-items-center justify-content-end">
                                <PrimaryButton size="sm" onClick={generateCodes} isLoading={qrLoading}>Generate Codes</PrimaryButton>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="pt-4">
                {
                    qrCodes?.length ?
                        <Card className="p-4">
                            <Text weight="bold" className="pb-4" >Generated codes</Text>
                            {
                                qrCodes.length > 1 ?
                                    <>
                                        <div className="qb-plans-listing-grid-container d-grid gap-4">
                                            {
                                                qrCodes.map(item => {
                                                    return (
                                                        <div className="w-100 d-flex flex-column p-3 qb-border-solid-dark qb-br-16" key={`code-${item.id}`}>
                                                            <img src={item.code} alt={item.name} className="w-100" />
                                                            <Text weight="bold" color="muted" size="paragraph-sm" className="pt-3">{item.id}</Text>
                                                            <Text className="pt-3" size="paragraph-md">{item.name}</Text>
                                                            <div className="d-flex align-items-center gap-1">
                                                                <Text size="tag">{item.url}</Text>
                                                                <svg className="qb-copy-icon" width="14" height="14" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={(e) => handleCopy(e, item.url)}>
                                                                    <path d="M21 21H27V5H11V11" className="qb-stroke-dark" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M21 11H5V27H21V11Z" className="qb-stroke-dark" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </>
                                    :
                                    <div className="qb-plans-listing-grid-container qb-plans-listing-grid-container-sm d-grid gap-4">
                                        {
                                            qrCodes.map(item => {
                                                return (
                                                    <div className="w-100 d-flex flex-column p-3 qb-border-solid-dark qb-br-16" key={`code-${item.id}`}>
                                                        <img src={item.code} alt={item.name} className="w-100" />
                                                        <Text weight="bold" color="muted" size="paragraph-sm" className="pt-3">{item.id}</Text>
                                                        <Text className="pt-3" size="paragraph-md">{item.name}</Text>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <Text size="tag">{item.url}</Text>
                                                            <svg className="qb-copy-icon" width="14" height="14" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={(e) => handleCopy(e, item.url)}>
                                                                <path d="M21 21H27V5H11V11" className="qb-stroke-dark" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M21 11H5V27H21V11Z" className="qb-stroke-dark" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                            }
                            <div className="w-100 d-flex align-items-center justify-content-end pt-4">
                                <PrimaryButton size="sm" onClick={handleDownload} isLoading={downloading}>Download Codes</PrimaryButton>
                            </div>
                        </Card>
                        :
                        null
                }
            </div>
        </>
    )
}
export default CustomerDashboard;