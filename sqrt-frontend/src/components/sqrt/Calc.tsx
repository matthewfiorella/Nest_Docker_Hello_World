import React, { useState, useEffect } from 'react';
import  { withRouter, useHistory } from 'react-router-dom';

function Calc(): JSX.Element {
    let history = useHistory();
    interface IValues {
        [key: string]: any;
    }
    interface subResult {
        success: boolean,
        value: string
    }
    const [val, setVal] = useState<IValues>([])
    const [loading, setLoading] = useState<boolean>(false);
    const [submitResult, setSubmitResult] = useState<subResult>({
        success: false,
        value: "Input a Number"
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
            history.push('/');
        }, 1500);
    }

    const submitform = async (formData: {}) => {
        try {
            const response = await fetch( "http://localhost:8080/sqrt", {
                method: "POST",
                mode: "cors",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }),
                body: JSON.stringify(formData)
            });
            const calc = (await response.json()).sqrt
            return ({
                success: response.ok,
                value: calc
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
                <div className="form-group col-md-4 pull-right">
                    <button className="btn btn-success" type="submit">
                        Calculate Square Root
                    </button>
                    {loading &&
                        <span className="fa fa-circle-o-notch fa-spin" />
                    }
                </div>
                <div className="form-group col-md-4 pull-right">
                    {submitResult.value}
                </div>
            </form>
        </div>
        </div>
    );
}
export default withRouter(Calc)