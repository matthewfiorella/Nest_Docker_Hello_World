import React, { useState, useEffect } from 'react';
import  { withRouter, useHistory } from 'react-router-dom';
import './HistoryTable.css';

function Postal(): JSX.Element {
    let history = useHistory();
    interface IValues {
        [key: string]: any;
    }
    interface subResult {
        success: boolean,
        value: string
    }
    interface resHistory{
        postal?: string,
        health?: string,
        time?: number,
    }

    const [val, setVal] = useState<IValues>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [postalHistory, setPostalHistory] = useState<resHistory[]>( [] )
    const [submitResult, setSubmitResult] = useState<subResult>({
        success: false,
        value: "Input a Postal Code"
    });

    const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);
        const formData = val
        const submitResult: subResult = await submitform(formData);
        setSubmitResult(submitResult);
        setVal({...val, formData})
        setLoading(false);
        setTimeout(() => {
            history.push('/postal');
        }, 1500);
    }

    const submitform = async (formData: {}) => {
        try {
            const response = await fetch( "https://backend.spikeappdemo.com/postal", {
                method: "POST",
                mode: "cors",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }),
                body: JSON.stringify(formData)
            });
            const trust = (await response.json()).trust
            return ({
                success: response.ok,
                value: trust
            });
        } catch (ex) {
            return ({
                success: false,
                value: -1
            });
        }
    }
    const setFormValues = (formValues: IValues) => {
        setVal({...val, ...formValues})
    }
    const handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        setFormValues({ [e.currentTarget.name]: e.currentTarget.value })
    }

    useEffect( () => {
        try {
            fetch( "https://backend.spikeappdemo.com/postal").then( (val: Response) => {
                val.json().then( (data) => {
                    const arr: resHistory[] = new Array()
                    for(let i = 0; i < 5; i++) {
                        const hist: resHistory = {
                            postal: String(data[i]?.PostalCode?.S),
                            health: String(data[i]?.PrimaryHealthcareTrust?.S),
                            time: Number(data[i]?.EntryTime?.N)
                        }
                        arr.push(hist)
                    }
                    setPostalHistory(arr)
                })
            })
        } catch (err) {
            console.log(err)
        }    
    }, [submitResult])

    return (
        <div>
        <div className={"col-md-12 form-wrapper"}>
            <h2> Postal Code Lookup </h2>
            {!submitResult.success && (
                <div className="alert alert-info" role="alert">
                    Fill the form to lookup the primary care trust associated with the Postal Code.
                </div>
            )}
            {submitResult.success && (
                <div className="alert alert-info" role="alert">
                    The form was successfully submitted!
                </div>
            )}
            <form id={"create-post-form"} onSubmit={handleFormSubmission} noValidate={true}>
                <div className="form-group col-md-12">
                    <label> Input Code </label>
                    <input type="text" id="input" onChange={(e) => handleInputChanges(e)} name="input" className="form-control" placeholder="Enter number" />
                </div>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-success" type="submit">
                        Lookup Primary Care Trust
                    </button>
                    {loading &&
                        <span className="fa fa-circle-o-notch fa-spin" />
                    }
                </div>
                {submitResult.success && (
                <div className="d-flex justify-content-center">
                    The Primary Health Trust for {val.input} is: {submitResult.value}
                </div>)}
            </form>
        </div>
        <div>
            Previous Five Lookups
        </div>
        <div className='HistoryTable'>
            <table>
                <tr>
                    <th> Postal Code </th>
                    <th> Primary Health Trust </th>
                </tr>
                { postalHistory.map( (item) => {
                return <tr key={item?.time}>
                    <td> {item?.postal} </td>
                    <td> {item?.health} </td>
                </tr> } ) }
            </table>
        </div>
        </div>
    );
}
export default withRouter(Postal)