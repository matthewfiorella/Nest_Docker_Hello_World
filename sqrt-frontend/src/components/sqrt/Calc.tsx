import React, { useState, useEffect } from 'react';
import  { withRouter, useHistory } from 'react-router-dom';
import useToken from '../../customHooks/useToken';
function Calc(): JSX.Element {
    let history = useHistory();
    interface IValues {
        [key: string]: any;
    }
    interface subResult {
        success: boolean,
        value: string,
        auth: boolean
    }
    const { token, setToken } = useToken();
    const [val, setVal] = useState<IValues>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [warning, setWarning] = useState<boolean>(false);
    const [submitResult, setSubmitResult] = useState<subResult>({
        success: false,
        value: "",
        auth: false,
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
            history.push('/sqrt');
        }, 1500);
    }

    const submitform = async (formData: {}) => {
        const tokenString = sessionStorage.getItem('token');
        try {
            const response = await fetch( "http://ec2-16-171-2-225.eu-north-1.compute.amazonaws.com:8080/sqrt", {
                method: "POST",
                mode: "cors",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": "Bearer " + tokenString,
                }),
                body: JSON.stringify(formData)
            });
            const result = (await response.json())
            if (result.statusCode && result.statusCode != 200) {
                return ({
                    success: false,
                    auth: false,
                    value: "Not Authorized!"
                })
            }
            const calc = result.sqrt
            return ({
                success: response.ok,
                auth: true,
                value: calc
            });
        } catch (ex) {
            return ({
                success: false,
                auth: false,
                value: "Submission Error"
            });
        }
    }
    const setFormValues = (formValues: IValues) => {
        setVal({...val, ...formValues})
    }
    const handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (isNaN(Number(e.currentTarget.value))) {
            setWarning(true)
        }
        else {
            setWarning(false)
        }
        setFormValues({ [e.currentTarget.name]: e.currentTarget.value })
    }
    return (
        <div>
        <div className={"col-md-12 form-wrapper"}>
            <h2> Calculate Square Root </h2>
            {!submitResult.success && (
                <div className="alert alert-info" role="alert">
                    Fill the form to calculate the sqrt of input number.
                </div>
            )}
            {submitResult.success && (
                <div className="alert alert-info" role="alert">
                    The form was successfully submitted!
                </div>
            )}
            <form id={"create-post-form"} onSubmit={handleFormSubmission} noValidate={true}>
                <div className="form-group col-md-12">
                    <label> Input Number </label>
                    <input type="text" id="input" onChange={(e) => handleInputChanges(e)} name="input" className="form-control" placeholder="Enter number" />
                </div>
                <div className="d-flex justify-content-center">
                    <button className="btn btn-success" type="submit">
                        Calculate Square Root
                    </button>
                    {loading &&
                        <span className="fa fa-circle-o-notch fa-spin" />
                    }
                </div>
                {warning && (
                    <div className="d-flex justify-content-center">
                        Not valid Input! Please input a Number!
                    </div>
                )}
                {submitResult.success && !warning && 
                    <div className="d-flex justify-content-center">
                        Most Recent Result: {submitResult.value}
                    </div>
                }
                {!submitResult.success && !submitResult.auth && 
                    <div className="d-flex justify-content-center">
                        {submitResult.value}
                    </div>
                }
            </form>
        </div>
        </div>
    );
}
export default withRouter(Calc)