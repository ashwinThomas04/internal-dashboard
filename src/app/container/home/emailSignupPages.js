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
import { codec, utils } from "../../utils";

const BASE_PATH = "qbriux.io/email/register";
const EMAILER = [
    { label: "Chef driven - generic email signup", merchantName: "Chef driven", customList: null, amx: "BLVG", merchantId: "1510", tempId: codec.chrono10() },
    { label: "Sempre Oggi - generic email signup", merchantName: "Sempre Oggi", customList: null, amx: "BJYJ", merchantId: "1431", tempId: codec.chrono10() },
    { label: "Sempre Oggi - 'Bar Contacts' custom list", merchantName: "Sempre Oggi", customList: "Bar Contacts", amx: "BJYJ", merchantId: "1431", queries: [{ key: "clx", value: "bar-contacts" }], tempId: codec.chrono10() },
    { label: "Marseille - generic email signup", merchantName: "Marseille", customList: null, amx: "BJYF", merchantId: "1427", tempId: codec.chrono10() },
    { label: "Playa Betty's - 'World cup competition' custom list", merchantName: "Playa Betty's", customList: "World cup competition", amx: "JKB", merchantId: "1305", queries: [{ key: "clx", value: "world-cup" }], tempId: codec.chrono10() },
    { label: "Playa Betty's - generic email signup", merchantName: "Playa Betty's", customList: null, amx: "JKB", merchantId: "1305", tempId: codec.chrono10() },
    { label: "5 Napkin Burger - Generic email signup", merchantName: "5 Napkin Burger", customList: null, amx: "BRYJ", merchantId: "1572", tempId: codec.chrono10() }
    // { label: "", amx: "", merchantId: "" }
]

const EmailSignupPages = () => {
    const [selectedPages, setSelectedPages] = useState([]);
    const [qrLoading, setQrLoading] = useState(false);
    const [qrCodes, setQrCodes] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const alerts = useAlerts();

    const handlePageSelection = (page) => {
        setSelectedPages(prev => {
            if (prev.includes(page.tempId)) return prev.filter(id => id !== page.tempId);
            return [...prev, page.tempId];
        })
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

    const generateCodes = async () => {
        setQrLoading(true);
        let b = [];
        if (selectedPages.length) {
            EMAILER.forEach((item) => {
                if (selectedPages.includes(item.tempId)) {
                    const url = `https://${item.base ? item.base : "customer"}.${BASE_PATH}?amx=${item.amx}${item.queries ? '&' + item.queries.map((q) => `${q.key}=${q.value}`).join('&') : ''}`;
                    b.push({ ...item, url, id: item.merchantId, name: item.label });
                }
            });
        } else {
            alerts.triggerToast("No pages selected.", "Please select at least one page.", "ERROR");
            return;
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
        const folder = zip.folder(`email-signup-page-codes-${codec.chrono10()}`);

        codes.forEach((qr) => {
            const base64Data = qr.code.split(',')[1];

            const filename = utils.sanitizeName(qr.name);
            folder.file(`${filename}.png`, base64Data, { base64: true });
        });

        try {
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `email-signup-page-codes.zip`);
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

    return (
        <>
            <Text size="title-sm" weight="black" className="pt-2">Available Pages</Text>
            <Text className="pb-4">Select one or more pages to generate and download the QR codes.</Text>
            <div className="qb-offers-listing-grid-container w-100 d-grid gap-3">
                {EMAILER.map((item) => {
                    const url = `https://${item.base ? item.base : "customer"}.${BASE_PATH}?amx=${item.amx}${item.queries ? '&' + item.queries.map((q) => `${q.key}=${q.value}`).join('&') : ''}`;
                    return (
                        <Card className={`p-4 d-flex flex-column align-items-stretch justify-content-between qb-transition-base ${selectedPages.includes(item.tempId) ? "qb-border-solid-primary" : ""}`} key={item.tempId} onClick={() => { handlePageSelection(item) }}>
                            <div className="d-flex flex-column align-items-stretch w-100">
                                {
                                    selectedPages.includes(item.tempId) ?
                                        <div className="d-flex align-items-center justify-content-between gap-3">
                                            <div className="d-flex align-items-baseline gap-2">
                                                <Text size="title-sm" weight="bold">{item.merchantName}</Text>
                                                <Text size="paragraph-xs" weight="regular">({item.merchantId})</Text>
                                            </div>
                                            <Badge size="sm" color="primary" weight="black">SELECTED</Badge>
                                        </div>
                                        :
                                        <div className="d-flex align-items-baseline gap-2">
                                            <Text size="title-sm" weight="bold">{item.merchantName}</Text>
                                            <Text size="paragraph-xs" weight="regular">({item.merchantId})</Text>
                                        </div>
                                }
                                <Text size="paragraph-xs">{item.customList ? "Custom List" : "Generic Page"}</Text>
                                {item.customList ? <Text size="tag" color="primary" weight="bold">{item.customList}</Text> : null}
                                <div className="d-flex align-items-center justify-content-center">
                                    <img src={`${CONFIG.assetsBase}/dashboard/${item.merchantId}/header.webp`} alt={item.label} className="qb-merchant-logo-image" />
                                </div>
                                <Text size="paragraph-sm" weight="bold">URL</Text>
                                <div className="d-flex align-items-start gap-2">
                                    <Text size="paragraph-xs">{url}</Text>
                                    <div>
                                        <svg className="qb-copy-icon" width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={(e) => handleCopy(e, url)}>
                                            <path d="M21 21H27V5H11V11" className="qb-stroke-dark" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M21 11H5V27H21V11Z" className="qb-stroke-dark" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
            <div className="d-flex justify-content-end py-4">
                <PrimaryButton size="sm" onClick={generateCodes} isLoading={qrLoading} isActive={selectedPages.length}>Generate Codes</PrimaryButton>
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

export default EmailSignupPages;