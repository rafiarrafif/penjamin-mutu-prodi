import type { GetSpecificRequirementInput } from "../schemas/getSpecificRequirement.schema";
import type { GetSpecificRequirementRepository } from "../repositories/getSpecificRequirement.repository";

export class GetSpecificRequirementService {
  constructor(private readonly repository: GetSpecificRequirementRepository) {}
  async execute(input: GetSpecificRequirementInput) {
    const requirement = await this.repository.findById(input.requirement_id);
    if (!requirement)
      throw Object.assign(new Error("Data requirement not found."), {
        statusCode: 404,
      });
    const departments = requirement.departmentPics.map(
      (pic: {
        department: {
          id: string;
          name: string;
          histories: unknown[];
        };
      }) => {
        const activeMemberCount = pic.department.histories.length;
        return {
          id: pic.department.id,
          name: pic.department.name,
          active_member_count: activeMemberCount,
        };
      },
    );
    const { departmentPics: _pics, ...rest } = requirement;
    return { ...rest, departments };
  }
}
