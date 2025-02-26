import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";
import { storage } from '@/firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import mime from 'mime-types';
import { readFileAsBase64 } from "@/utils/FileUtils";

export default function ProductForm(
    {
        _id,
        title: existingTitle,
        description: existingDescription,
        price: existingPrice,
        images: existingImages,
        category: assignedCategory,
        properties: assignedProperties,
        stock: existingStock,
        pricePerZone: existingPricePerZone,
        stockAvailable: existingStockAvailable,
        cost: existingCost
    }) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(assignedCategory || '');
    const [productProperties, setProductProperties] = useState(assignedProperties || {});
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [stock, setStock] = useState(existingStock || []);
    const [pricePerZone, setPricePerZone] = useState(existingPricePerZone || []);
    const [stockAvailable, setStockAvailable] = useState(existingStockAvailable || false);
    const [cost, setCost] = useState(existingCost || 0);

    const router = useRouter();

    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }, []);

    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
            title,
            description,
            price,
            images,
            category,
            properties: productProperties,
            stock,
            pricePerZone,
            stockAvailable,
            cost
        };

        if (_id) {
            //update
            await axios.put('/api/products', { ...data, _id })
        }
        else {
            //create
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push('/products');
    }

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true);

            const data = [];

            for (const file of files) {
                console.log("file: ", file);
                data.push(file);
            }

            const links = [];
            data.forEach(async file => {
                const base64File = await readFileAsBase64(file);
                
                const ext = file.name.split('.').pop();
                const newFileName = Date.now() + '.' + ext;
                const storageRef = ref(storage, 'files/productimages/' + newFileName);
                const metadata = {
                    contentType: 'image/' + ext
                }

                //write a code to upload the file to firebase storage
                const uploadTask = await uploadBytesResumable(
                    storageRef,
                    base64File,
                    metadata
                );
                
                const downloadURL = await getDownloadURL(uploadTask.ref);
                links.push(downloadURL);
            })

            setImages(oldImages => {
                return [...oldImages, ...links];
            })
            setIsUploading(false);
        }
    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        while (catInfo?.parent?._id) {
            const parentCat = categories.find(({ _id }) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = { ...prev };
            newProductProps[propName] = value;
            return newProductProps;
        });
    }

    function addPrice() {
        setPricePerZone(prev => {
            return [...prev, { name: '', values: '' }];
        })
    }

    function removePrice(indexToRemove) {
        setPricePerZone(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

    function handlePriceNameChange(index, property, newName) {
        setPricePerZone(prev => {
            const prices = [...prev];
            prices[index].name = newName;
            return prices;
        });
    }

    function handlePriceValuesChange(index, property, newValues) {
        setPricePerZone(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }

    function addStock() {
        setStock(prev => {
            return [...prev, { dateIni: parseISO(new Date()), dateEnd: parseISO(new Date()) }];
        })
    }

    function removeStock(indexToRemove) {
        setStock(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

    function handleStockDateIniChange(index, property, newName) {
        setStock(prev => {
            const stocks = [...prev];
            stocks[index].dateIni = newName;
            return stocks;
        });
    }

    function handleStockDateEndChange(index, property, newValues) {
        setStock(prev => {
            const properties = [...prev];
            properties[index].dateEnd = newValues;
            return properties;
        });
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Product name</label>
            <input type="text" placeholder="product name"
                value={title} onChange={ev => setTitle(ev.target.value)}>
            </input>
            <label>Category</label>
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
                <option value="" key="-1">Uncategorized</option>
                {categories.length > 0 && categories.map(c => (
                    <option value={c._id} key={c._id}>{c.name}</option>
                ))}
            </select>
            <label>Available</label>
            <select value={stockAvailable} onChange={ev => setStockAvailable(ev.target.value)}>
                <option value={true}>Yes</option>
                <option value={false}>No</option>
            </select>

            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div className="">
                    <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
                    <div>
                        <select value={productProperties[p.name]}
                            onChange={ev => setProductProp(p.name, ev.target.value)}>
                            {p.values.map(v => (
                                <option value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}

            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable list={images} setList={updateImagesOrder}
                    className="flex flex-wrap gap-1">
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                            <img src={link} alt="" className="rounded-lg"></img>
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 p-1 bg-gray-200 flex items-center">
                        <Spinner></Spinner>
                    </div>
                )}
                <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sg bg-white shadow-md border border-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>Add image</div>
                    <input type="file" onChange={uploadImages} className="hidden"></input>
                </label>
            </div>
            <label>Description</label>
            <textarea placeholder="description"
                value={description} onChange={ev => setDescription(ev.target.value)}>
            </textarea>
            <label>Price</label>
            <input type="number" placeholder="price"
                value={price} onChange={ev => setPrice(ev.target.value)}>
            </input>
            <label>Cost</label>
            <input type="number" placeholder="price"
                value={cost} onChange={ev => setCost(ev.target.value)}>
            </input>

            <div className="mb-2">
                <label className="block">Prices per zone</label>
                <button
                    onClick={addPrice}
                    type="button"
                    className="btn-default text-sm mb-2">
                    Add new price
                </button>
                {pricePerZone && pricePerZone.length > 0 && pricePerZone.map((price, index) => (
                    <div className="flex gap-1 mb-2" key={index}>
                        <input type="text"
                            value={price.name}
                            onChange={ev => handlePriceNameChange(index, price, ev.target.value)}
                            placeholder="price zone"
                            className="mb-0" />
                        <input type="text"
                            value={price.values}
                            onChange={ev => handlePriceValuesChange(index, price, ev.target.value)}
                            placeholder="price"
                            className="mb-0" />
                        <button
                            onClick={() => removePrice(index)}
                            type="button"
                            className="btn-red">Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="mb-2">
                <label className="block">Stock</label>
                <button
                    onClick={addStock}
                    type="button"
                    className="btn-default text-sm mb-2">
                    Add new stock
                </button>
                {stock && stock.length > 0 && stock.map((data, index) => (
                    <div className="flex gap-1 mb-2" key={index}>
                        <DatePicker
                            style={{ marginB: '0' }}
                            selected={parseISO(data.dateIni)}
                            onChange={(date) => {
                                date.setHours(0, 0, 0, 0);
                                handleStockDateIniChange(index, data, date);
                            }}
                        />
                        <DatePicker
                            selected={parseISO(data.dateEnd)}
                            onChange={(date) => {
                                date.setHours(0, 0, 0, 0);
                                handleStockDateEndChange(index, data, date);
                            }}
                        />
                        <button
                            onClick={() => removeStock(index)}
                            type="button"
                            className="btn-red">Remove
                        </button>
                    </div>
                ))}
            </div>
            <button type="submit" className="btn-primary">Save</button>
        </form >
    )
}