package util.dataManage;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.io.Serializable;
import java.util.List;

public interface GenericDao<T, ID extends Serializable> {
	public abstract List<T> findAll();

	public abstract List<T> findAll(Sort paramSort);

	public abstract List<T> findAll(Iterable<ID> paramIterable);

	public abstract T getOne(ID paramID);
	
	public abstract T findOne(ID paramID);

	public abstract boolean exists(ID paramID);

	public abstract long count();
	
	public abstract Page<T> findAll(Pageable paramPageable);
	
	public abstract T findOne(Specification<T> paramSpecification);

	public abstract List<T> findAll(Specification<T> paramSpecification);

	public abstract Page<T> findAll(Specification<T> paramSpecification,
                                    Pageable paramPageable);

	public abstract List<T> findAll(Specification<T> paramSpecification,
                                    Sort paramSort);

	public abstract long count(Specification<T> paramSpecification);
}
