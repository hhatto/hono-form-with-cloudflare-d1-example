type Props = {
  formId: string
  name?: string
  hometown?: string
  message?: string
}

export const Form = ({ formId, name, hometown, message }: Props) => {
  return (
    <html>
      <body>
        <h1>Form Title</h1>
        <form method="POST" action={`/form/${formId}`}>
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" value={name} required />
          </div>
          <div class="form-group">
            <label for="hometown">Hometown</label>
            <input type="text" id="hometown" name="hometown" value={hometown} required />
          </div>
          <button type="submit">Save</button>
          <p>{message}</p>
        </form>
      </body>
    </html>
  );
}
