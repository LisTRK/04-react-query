import { Formik, Form, type FormikHelpers, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './SearchBar.module.css';

interface SearchBarProps{
    onSubmit: (query: string) => void,
    
}
const initialValues = {
    query: '',
};

const SignupSchema = Yup.object().shape({
   query: Yup.string()
     .min(2, 'Too Short!')
     .max(50, 'Too Long!')
     .required('Required'),
 });


const SearchBar = ({onSubmit}:SearchBarProps) => {
    const hendleSubmit = ((values: {
        query: string;
    }, formikHelpers: FormikHelpers<{
        query: string;
    }>) => {
        onSubmit(values.query)
        formikHelpers.resetForm();

    });

    return <header className={styles.header}>
        <div className={styles.container}>
            <a
                className={styles.link}
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
            >
                Powered by TMDB
            </a>

        <Formik
            initialValues={initialValues}
            validationSchema={SignupSchema}
            onSubmit={hendleSubmit}
        >
                <Form className={styles.form}>
                    <Field className={styles.input}
                        type="text"
                        name="query"
                        autoComplete="off"
                        placeholder="Search movies..."
                        autoFocus />
          
                    <ErrorMessage component="span" className={styles.text} name='query' />
                    {/* <ErrorMessage name="query" render={msg => <p>{msg}</p>} /> */}
                    
                    <button type="submit">Submit</button>
        
                </Form>
          </Formik>
        </div>
    </header>;
}

export default SearchBar;