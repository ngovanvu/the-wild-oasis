import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

import { useForm } from "react-hook-form";

import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

//Nó nhận một đối số có tên là cabinToEdit thông qua props.
//Nếu không có giá trị được truyền cho cabinToEdit, nó sẽ mặc định là một đối tượng trống ({}).
function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  //------ giai doan 2: cabinToEdit-------
  const { id: editId, ...editValues } = cabinToEdit;
  console.log(editId);
  const isEditSession = Boolean(editId);
  console.log("isEditSession", isEditSession);

  //------ giai doan 2: cabinToEdit-------

  //formState sử dụng lấy trạng thai của validate , errors dùng vào form
  //getValues lấy giá trị trong form
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;
  // đã cắt qua thành funtion cho gọn
  const { createCabin, isCreating } = useCreateCabin();
  const { editCabin, isEditing } = useEditCabin();

  const isWorking = isCreating || isEditing;

  function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image[0];
    // khi kg nhập đủ data của form cần thì nó sẽ k vào đây
    // console.log(data);
    if (isEditSession) {
      editCabin(
        { newCabinData: { ...data, image }, id: editId },
        //?  do sử dụng useQueryClient nên có thể truy cập vào useCreateCabin lấy được dữ liệu trả về và các chức năng như là error suscess
        {
          onSuccess: (data) => {
            reset(); // đã cắt qua thành funtion cho gọn nên k sử dụng được reset ở hookform nên sử dụng ở đây
            onCloseModal?.();
          },
        }
      );
    } else {
      createCabin(
        //? do sử dụng useQueryClient nên có thể truy cập vào useCreateCabin lấy được dữ liệu trả về và các chức năng như là error suscess
        { ...data, image: image },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );

      // createCabin({ ...data, image: data.image[0] })
    }
  }
  function onError(errors) {
    // hiện error khi không nhập vào input field, hiển thị thông báo lỗi
    // console.log(errors);
  }
  return (
    //onCloseModal đây là một hàm => luôn trả về là true, còn khi mà đóng thì nó là null do bên component Modal xét => false
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? "modal" : "regular"}>
      <FormRow label="cabin name" error={errors?.name?.message}>
        <Input
          disabled={isWorking}
          type="text"
          id="name"
          {...register("name", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          disabled={isWorking}
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>
      {/* <FormRow2>
        <Label htmlFor="maxCapacity">Maximum capacity</Label>
        <Input
          type="number"
          id="maxCapacity"
          {...register("maxCapacity", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
         {errors?.maxCapacity?.message && <Error>{errors.maxCapacity.message}</Error>}
      </FormRow2> */}
      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          disabled={isWorking}
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>
      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          disabled={isWorking}
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            //sai thì hiển thị "Discount should be less than regular price"
            validate: (value) => value <= getValues().regularPrice || "Discount should be less than regular price",
          })}
        />
      </FormRow>
      <FormRow label="Description for website" error={errors?.description?.message}>
        <Textarea
          disabled={isWorking}
          type="number"
          id="description"
          defaultValue=""
          {...register("description", {
            required: "This field is required",
          })}
        />
      </FormRow>
      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          type="file"
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>
      <FormRow>
        {/* type is an HTML attribute! 
        onClick={() => onCloseModal?.()  thường thì chỉ cần onCloseModal nhưng sử dụng hàm vì nó sử dụng Optional Chaining trong javascript
        để có thể khi sử dụng ở chỗ khác thì nó sẽ không hiển thị ra lỗi bên chỗ khác không có onCloseModal
        */}
        <Button variation="secondary" type="reset" onClick={() => onCloseModal?.()}>
          Cancel
        </Button>
        {/* Nếu isEditSession mà là true =>  có editId => ID cần chỉnh sửa thì sẽ trả về "Edit Cabin" và ngược lại */}
        <Button disabled={isWorking}>{isEditSession ? "Edit Cabin" : "Create new Cabin"}</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
